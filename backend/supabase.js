// backend/supabase.js
// Centralized Supabase PostgreSQL Database & Storage Connector for SafeCity

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'incident-evidence';

const isConfigured = Boolean(
  SUPABASE_URL &&
  (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY) &&
  !SUPABASE_URL.includes('your-project-id')
);

let supabaseClient = null;
if (isConfigured) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('[SafeCity Supabase] Successfully initialized central cloud client at:', SUPABASE_URL);
  } catch (err) {
    console.warn('[SafeCity Supabase] Initialization warning:', err.message);
  }
} else {
  console.log('[SafeCity Supabase] Cloud credentials not configured in .env. Active in local/fallback resilience mode.');
}

// Allowed MIME types for photo evidence
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates uploaded image evidence
 */
function validateEvidenceImage(buffer, mimeType) {
  if (!buffer || !(buffer instanceof Buffer) || buffer.length === 0) {
    throw new Error('Image file data is empty or missing.');
  }
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Image file exceeds the 5MB maximum limit (received ${(buffer.length / (1024 * 1024)).toFixed(2)} MB).`);
  }
  if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    throw new Error(`Unsupported image format "${mimeType}". Allowed formats: JPEG, PNG, WebP.`);
  }

  // Basic magic number validation to verify file header content
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error('File signature does not match a valid JPEG, PNG, or WebP image.');
  }
  return true;
}

/**
 * Upload an evidence image to Supabase Storage
 */
async function uploadEvidence(buffer, originalName, mimeType) {
  validateEvidenceImage(buffer, mimeType);

  const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  const uniqueId = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  const filePath = `evidence/${uniqueId}.${ext}`;

  if (supabaseClient) {
    const { data, error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      console.warn('[SafeCity Supabase Storage] Upload error:', error.message);
      throw new Error(`Supabase Storage upload failed: ${error.message}`);
    }

    // Try getting signed URL (valid for 24 hours) or public URL
    const { data: signedData } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, 86400);

    const publicUrl = signedData?.signedUrl || `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;

    return {
      success: true,
      filePath: data.path,
      url: publicUrl
    };
  }

  // Fallback storage representation when Supabase is not connected
  const simulatedUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
  return {
    success: true,
    filePath,
    url: simulatedUrl,
    fallback: true
  };
}

/**
 * Generates a short-lived signed URL for an authorized moderator to view private evidence
 */
async function getSignedEvidenceUrl(filePath, expiresIn = 3600) {
  if (supabaseClient && filePath) {
    try {
      const { data, error } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, expiresIn);
      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch (err) {
      console.warn('[SafeCity Supabase Storage] Signed URL warning:', err.message);
    }
  }
  return null;
}

/**
 * Fetch incidents from Supabase
 */
async function fetchIncidentsFromSupabase({ status, category, severity, limit = 100 }) {
  if (!supabaseClient) return null;

  try {
    let query = supabaseClient
      .from('incident_reports')
      .select('*')
      .order('incident_time', { ascending: false })
      .limit(limit);

    if (status && status.toUpperCase() !== 'ALL') {
      query = query.eq('status', status.toUpperCase());
    } else if (!status) {
      query = query.in('status', ['VERIFIED', 'PENDING']);
    }

    if (category && category !== 'ALL') {
      query = query.eq('category', category);
    }
    if (severity && severity !== 'ALL') {
      query = query.eq('severity', severity);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[SafeCity Supabase] Query incidents error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[SafeCity Supabase] Fetch incidents exception:', err.message);
    return null;
  }
}

/**
 * Insert a new incident report into Supabase
 */
async function insertIncidentToSupabase(record) {
  if (!supabaseClient) return null;

  try {
    const payload = {
      report_id: record.report_id,
      category: record.category,
      severity: record.severity || 'Medium',
      description: record.description,
      latitude: record.latitude,
      longitude: record.longitude,
      location_name: record.location_name || 'Bengaluru Street Pin',
      image_paths: record.image_paths || (record.image_path ? [record.image_path] : []),
      image_urls: record.image_urls || (record.image_url ? [record.image_url] : []),
      status: 'PENDING',
      is_anonymous: record.is_anonymous !== false,
      incident_time: record.incident_time || new Date().toISOString()
    };

    const { data, error } = await supabaseClient
      .from('incident_reports')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('[SafeCity Supabase] Insert incident error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[SafeCity Supabase] Insert incident exception:', err.message);
    return null;
  }
}

/**
 * Update incident status in Supabase (Verify or Reject with audit)
 */
async function updateIncidentStatusInSupabase(reportId, { status, reviewed_by, moderator_notes, rejection_reason }) {
  if (!supabaseClient) return null;

  try {
    const updatePayload = {
      status: status.toUpperCase(),
      reviewed_by: reviewed_by || 'Bengaluru Safety Command Moderator',
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (moderator_notes !== undefined) updatePayload.moderator_notes = moderator_notes;
    if (rejection_reason !== undefined) updatePayload.rejection_reason = rejection_reason;

    const { data, error } = await supabaseClient
      .from('incident_reports')
      .update(updatePayload)
      .eq('report_id', reportId)
      .select()
      .single();

    if (error) {
      console.warn('[SafeCity Supabase] Update incident status error:', error.message);
      return null;
    }

    // Explicitly write audit log to incident_status_history as well
    try {
      await supabaseClient.from('incident_status_history').insert([{
        incident_id: data.id,
        report_id: reportId,
        new_status: status.toUpperCase(),
        reviewed_by: updatePayload.reviewed_by,
        moderator_notes: moderator_notes || rejection_reason || null,
        created_at: new Date().toISOString()
      }]);
    } catch (auditErr) {
      // Non-fatal if trigger already handled it
    }

    return data;
  } catch (err) {
    console.warn('[SafeCity Supabase] Update status exception:', err.message);
    return null;
  }
}

/**
 * Find incident by tracking ID in Supabase
 */
async function findIncidentByTrackingIdInSupabase(reportId) {
  if (!supabaseClient) return null;

  try {
    const { data, error } = await supabaseClient
      .from('incident_reports')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch (err) {
    return null;
  }
}

function reinitialize() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  module.exports.SUPABASE_URL = url;
  module.exports.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
  module.exports.STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'incident-evidence';
  module.exports.isConfigured = Boolean(url && key && !url.includes('your-project-id'));
  
  if (module.exports.isConfigured) {
    try {
      module.exports.supabaseClient = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      console.log('[SafeCity Supabase] Successfully reinitialized central cloud client at:', url);
    } catch (err) {
      console.warn('[SafeCity Supabase] Reinitialization warning:', err.message);
    }
  } else {
    module.exports.supabaseClient = null;
  }
}

module.exports = {
  isConfigured,
  supabaseClient,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  STORAGE_BUCKET,
  validateEvidenceImage,
  uploadEvidence,
  getSignedEvidenceUrl,
  fetchIncidentsFromSupabase,
  insertIncidentToSupabase,
  updateIncidentStatusInSupabase,
  findIncidentByTrackingIdInSupabase,
  reinitialize
};
