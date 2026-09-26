const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

/**
 * Trigger an Emergency SOS Alert
 */
const triggerEmergencyAlert = async (req, res, next) => {
  try {
    const userId = req.admin?.id || null;
    const {
      alert_type = 'INACTIVITY_TIMEOUT',
      latitude,
      longitude,
      address,
      contact_name,
      contact_phone,
      contact_relationship,
      session_duration_seconds = 0,
      details = {}
    } = req.body;

    if (!latitude || !longitude) {
      return next(new AppError('GPS coordinates (latitude, longitude) are required for emergency dispatch', 400));
    }

    // If user is authenticated and contact info was not supplied in body, look up user profile
    let effectiveContactName = contact_name;
    let effectiveContactPhone = contact_phone;
    let effectiveRelationship = contact_relationship;
    let userName = 'SafeCity Citizen';

    if (userId) {
      const userRes = await db.query(
        'SELECT full_name, emergency_contact, emergency_contact_name, emergency_contact_relationship FROM users WHERE id = $1',
        [userId]
      ).catch(() => ({ rows: [] }));

      if (userRes.rows.length > 0) {
        const u = userRes.rows[0];
        userName = u.full_name || userName;
        effectiveContactName = effectiveContactName || u.emergency_contact_name || 'Emergency Contact';
        effectiveContactPhone = effectiveContactPhone || u.emergency_contact;
        effectiveRelationship = effectiveRelationship || u.emergency_contact_relationship || 'Contact';
      }
    }

    if (!effectiveContactPhone) {
      effectiveContactPhone = 'Registered Guardian / Helpline';
    }
    if (!effectiveContactName) {
      effectiveContactName = 'Designated Contact';
    }

    const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    const dispatchMessage = `🚨 EMERGENCY ALERT from SafeCity Network:\n${userName} triggered a safety alert (${alert_type.replace('_', ' ')}).\nLocation: ${address || 'GPS Coordinates'}\nCoordinates: ${parseFloat(latitude).toFixed(5)}, ${parseFloat(longitude).toFixed(5)}\nLive Map: ${mapsUrl}`;

    // Store in emergency_alerts table
    const insertQuery = `
      INSERT INTO emergency_alerts (
        user_id, alert_type, latitude, longitude, address,
        contact_name, contact_phone, contact_relationship,
        status, session_duration_seconds, details
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'TRIGGERED', $9, $10)
      RETURNING id, created_at, status
    `;

    const alertDetails = {
      ...details,
      dispatched_at: new Date().toISOString(),
      user_name: userName,
      maps_url: mapsUrl
    };

    const insertRes = await db.query(insertQuery, [
      userId,
      alert_type,
      latitude,
      longitude,
      address || `Lat ${latitude}, Lng ${longitude}`,
      effectiveContactName,
      effectiveContactPhone,
      effectiveRelationship,
      session_duration_seconds,
      JSON.stringify(alertDetails)
    ]);

    const alertRecord = insertRes.rows[0];

    // WhatsApp / SMS web link for immediate device dispatch
    const encodedMsg = encodeURIComponent(dispatchMessage);
    const cleanPhone = effectiveContactPhone.replace(/[^0-9]/g, '');
    const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` : null;
    const smsLink = cleanPhone ? `sms:${cleanPhone}?body=${encodedMsg}` : null;

    res.status(201).json({
      success: true,
      data: {
        alert_id: alertRecord.id,
        status: alertRecord.status,
        timestamp: alertRecord.created_at,
        alert_type,
        user_name: userName,
        contact: {
          name: effectiveContactName,
          phone: effectiveContactPhone,
          relationship: effectiveRelationship
        },
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address: address || 'Live GPS Coordinates',
          google_maps_url: mapsUrl
        },
        dispatch_message: dispatchMessage,
        dispatch_channels: {
          whatsapp_link: whatsappLink,
          sms_link: smsLink
        }
      },
      message: 'Emergency notification logged and dispatch payload generated'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Resolve or cancel an active alert
 */
const resolveEmergencyAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status = 'RESOLVED', resolution_notes } = req.body;

    const result = await db.query(`
      UPDATE emergency_alerts
      SET status = $1,
          resolved_at = NOW(),
          details = jsonb_set(COALESCE(details, '{}'::jsonb), '{resolution_notes}', to_jsonb($2::text))
      WHERE id = $3
      RETURNING *
    `, [status, resolution_notes || 'User confirmed safety', id]);

    if (result.rows.length === 0) {
      return next(new AppError('Alert record not found', 404));
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: `Alert marked as ${status}`
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get recent alerts for current user or admin
 */
const getAlerts = async (req, res, next) => {
  try {
    const userId = req.admin?.id;
    const role = req.admin?.role;

    let query = 'SELECT * FROM emergency_alerts';
    let params = [];

    if (role !== 'admin' && role !== 'moderator') {
      query += ' WHERE user_id = $1';
      params.push(userId);
    }

    query += ' ORDER BY created_at DESC LIMIT 20';
    const result = await db.query(query, params).catch(() => ({ rows: [] }));

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  triggerEmergencyAlert,
  resolveEmergencyAlert,
  getAlerts
};
