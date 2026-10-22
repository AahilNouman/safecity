const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Helper: Haversine distance in meters
function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// =========================================================================
// IN-MEMORY SEED DATA & FALLBACK STORE (Active if MySQL is unavailable)
// =========================================================================
const MEMORY_SAFE_HAVENS = [
  { id: 1, name: 'Cubbon Park Police Station', type: 'POLICE', latitude: 12.9763, longitude: 77.5929, phone_number: '080-22942570', address: 'Kasturba Road, Near Cubbon Park Metro, Bengaluru 560001', is_open_24x7: 1 },
  { id: 2, name: 'Indiranagar Police Station', type: 'POLICE', latitude: 12.9784, longitude: 77.6408, phone_number: '080-22942542', address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038', is_open_24x7: 1 },
  { id: 3, name: 'Shivajinagar Police Station', type: 'POLICE', latitude: 12.9857, longitude: 77.6057, phone_number: '080-22942584', address: 'Broadway Road, Near Russell Market, Shivajinagar, Bengaluru 560051', is_open_24x7: 1 },
  { id: 4, name: 'Koramangala Police Station', type: 'POLICE', latitude: 12.9352, longitude: 77.6245, phone_number: '080-22942565', address: '20th Main Rd, 8th Block, Koramangala, Bengaluru 560095', is_open_24x7: 1 },
  { id: 5, name: 'Nagawara / KG Halli Police Outpost', type: 'POLICE', latitude: 13.0412, longitude: 77.6132, phone_number: '080-22942480', address: 'Outer Ring Road, Nagawara Junction, Bengaluru 560045', is_open_24x7: 1 },
  { id: 6, name: 'Manipal Hospital Emergency Trauma Center', type: 'HOSPITAL', latitude: 12.9592, longitude: 77.6476, phone_number: '080-25024444', address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru 560017', is_open_24x7: 1 },
  { id: 7, name: 'Bowring & Lady Curzon Hospital 24x7 ER', type: 'HOSPITAL', latitude: 12.9823, longitude: 77.6041, phone_number: '080-25591325', address: 'Lady Curzon Rd, Tasker Town, Shivajinagar, Bengaluru 560001', is_open_24x7: 1 },
  { id: 8, name: 'Victoria Hospital Emergency Care', type: 'HOSPITAL', latitude: 12.9636, longitude: 77.5746, phone_number: '080-26701150', address: 'Fort Rd, Near City Market Metro, Kalasipalyam, Bengaluru 560002', is_open_24x7: 1 },
  { id: 9, name: 'St. Johns Medical College Hospital ER', type: 'HOSPITAL', latitude: 12.9298, longitude: 77.6203, phone_number: '080-22065000', address: 'Sarjapur Main Rd, John Nagar, Koramangala, Bengaluru 560034', is_open_24x7: 1 },
  { id: 10, name: 'Apollo Pharmacy 24x7 — Indiranagar', type: 'PHARMACY_24X7', latitude: 12.9719, longitude: 77.6412, phone_number: '1860-500-0101', address: 'CMH Road, Near Indiranagar Metro Station, Bengaluru 560038', is_open_24x7: 1 },
  { id: 11, name: 'Apollo Pharmacy 24x7 — MG Road / Brigade', type: 'PHARMACY_24X7', latitude: 12.9738, longitude: 77.6074, phone_number: '080-25587341', address: 'Church Street & Brigade Rd Junction, Bengaluru 560001', is_open_24x7: 1 },
  { id: 12, name: 'MedPlus 24x7 Pharmacy — Shivajinagar', type: 'PHARMACY_24X7', latitude: 12.9882, longitude: 77.6038, phone_number: '040-67006700', address: 'Infantry Road Cross, Shivajinagar, Bengaluru 560001', is_open_24x7: 1 },
  { id: 13, name: 'Apollo Pharmacy 24x7 — Nagawara Manyata', type: 'PHARMACY_24X7', latitude: 13.0435, longitude: 77.6205, phone_number: '080-41256890', address: 'Opp Manyata Tech Park Gate 2, Nagawara, Bengaluru 560045', is_open_24x7: 1 },
  { id: 14, name: 'Shell 24x7 Bright Select Hub — Hebbal', type: 'COMMERCIAL_HUB', latitude: 13.0358, longitude: 77.5970, phone_number: '080-23541890', address: 'Bellary Road, Hebbal Flyover Service Rd, Bengaluru 560024', is_open_24x7: 1 }
];

const MEMORY_INCIDENTS = [
  {
    id: 1,
    report_id: 'AS-2026-10492',
    category: 'Poor Lighting',
    severity: 'High',
    latitude: 13.0235,
    longitude: 77.6142,
    location_name: 'Govindpura Main Rd Cross, Near Nagawara',
    description: 'Over 6 consecutive streetlights non-functional along Govindpura stretch after 9:30 PM. Heavy blind spots for solo commuters.',
    incident_time: '2026-10-20T21:40:00Z',
    status: 'VERIFIED',
    rejection_reason: null,
    is_anonymous: 1,
    created_at: '2026-10-20T21:45:00Z'
  },
  {
    id: 2,
    report_id: 'AS-2026-10834',
    category: 'Harassment',
    severity: 'High',
    latitude: 13.0195,
    longitude: 77.6118,
    location_name: 'Govindpura Junction Service Lane, Arabic College Post',
    description: 'Group on two-wheelers verbally harassing evening commuters near the unlit service lane intersection between 8:30 PM and 11:00 PM.',
    incident_time: '2026-10-20T22:15:00Z',
    status: 'VERIFIED',
    rejection_reason: null,
    is_anonymous: 1,
    created_at: '2026-10-20T22:20:00Z'
  },
  {
    id: 3,
    report_id: 'AS-2026-11209',
    category: 'Stalking',
    severity: 'High',
    latitude: 12.9772,
    longitude: 77.5731,
    location_name: 'Majestic Subway Underpass towards Platform 4',
    description: 'Persistent following reported by two students exiting night metro toward Kempegowda bus bays.',
    incident_time: '2026-10-19T23:05:00Z',
    status: 'VERIFIED',
    rejection_reason: null,
    is_anonymous: 1,
    created_at: '2026-10-19T23:10:00Z'
  },
  {
    id: 4,
    report_id: 'AS-2026-11470',
    category: 'Suspicious Activity',
    severity: 'Medium',
    latitude: 12.9885,
    longitude: 77.6048,
    location_name: 'Russell Market South Lane, Shivajinagar',
    description: 'Frequent loitering in unmonitored commercial corridor after 10 PM. Foot police patrol requested.',
    incident_time: '2026-10-19T22:10:00Z',
    status: 'VERIFIED',
    rejection_reason: null,
    is_anonymous: 1,
    created_at: '2026-10-19T22:15:00Z'
  },
  {
    id: 5,
    report_id: 'AS-2026-11982',
    category: 'Unsafe Area',
    severity: 'Medium',
    latitude: 12.9348,
    longitude: 77.6189,
    location_name: '8th Block Park Perimeter, Koramangala',
    description: 'Faded perimeter floodlights along park walkway. BBMP maintenance pending.',
    incident_time: '2026-10-18T20:30:00Z',
    status: 'VERIFIED',
    rejection_reason: null,
    is_anonymous: 1,
    created_at: '2026-10-18T20:35:00Z'
  },
  {
    id: 6,
    report_id: 'AS-2026-12340',
    category: 'Poor Lighting',
    severity: 'Low',
    latitude: 12.9745,
    longitude: 77.6432,
    location_name: '12th Main Road Cross, Indiranagar',
    description: 'Flickering streetlights behind metro pillar 42. Mild visibility degradation.',
    incident_time: '2026-10-17T21:00:00Z',
    status: 'VERIFIED',
    rejection_reason: null,
    is_anonymous: 1,
    created_at: '2026-10-17T21:05:00Z'
  }
];

const MEMORY_USERS = [];
const MEMORY_ALERTS = [];

// =========================================================================
// STATIC FILE SERVING & FRONTEND ROUTING
// =========================================================================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(__dirname));

function serveFrontend(req, res) {
  const candidatePaths = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, '..', 'index.html'),
    path.join(__dirname, '..', 'frontend', 'index.html')
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  res.status(404).send('SafeCity index.html not found');
}

app.get('/', serveFrontend);
app.get('/index.html', serveFrontend);

// =========================================================================
// REST API ENDPOINTS
// =========================================================================

// 1. GET /api/incidents — Fetch public verified incidents (or all for admin)
app.get('/api/incidents', async (req, res) => {
  const { status, category, severity } = req.query;
  try {
    let sql = 'SELECT * FROM incidents WHERE 1=1';
    const params = [];
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    } else {
      sql += ' AND status = "VERIFIED"';
    }
    if (category && category !== 'ALL') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (severity && severity !== 'ALL') {
      sql += ' AND severity = ?';
      params.push(severity);
    }
    sql += ' ORDER BY incident_time DESC';
    const [rows] = await pool.query(sql, params);
    return res.json({ success: true, incidents: rows });
  } catch (err) {
    // Fallback to in-memory store if DB is offline / not configured
    let filtered = MEMORY_INCIDENTS.filter(i => {
      const matchStatus = status ? i.status === status : i.status === 'VERIFIED';
      const matchCat = (!category || category === 'ALL') ? true : i.category === category;
      const matchSev = (!severity || severity === 'ALL') ? true : i.severity === severity;
      return matchStatus && matchCat && matchSev;
    });
    return res.json({ success: true, incidents: filtered, fallback: true });
  }
});

// 2. POST /api/incidents — Submit anonymous or user community safety report
app.post('/api/incidents', async (req, res) => {
  const { category, description, latitude, longitude, location_name, severity, incident_time, is_anonymous } = req.body;
  if (!category || !description || description.length < 10 || description.length > 2000) {
    return res.status(400).json({ success: false, error: 'Description must be 10-2000 characters.' });
  }
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const report_id = `AS-2026-${randomNum}`;

  try {
    const [result] = await pool.query(
      `INSERT INTO incidents (report_id, category, description, latitude, longitude, location_name, severity, incident_time, status, is_anonymous)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
      [report_id, category, description, latitude, longitude, location_name || 'Bengaluru Street Pin', severity || 'Medium', incident_time || new Date(), is_anonymous !== false]
    );
    return res.status(201).json({
      success: true,
      id: result.insertId,
      report_id,
      status: 'PENDING',
      message: 'Incident report submitted for moderator verification.'
    });
  } catch (err) {
    // In-memory fallback
    const newInc = {
      id: MEMORY_INCIDENTS.length + 1,
      report_id,
      category,
      description,
      latitude: Number(latitude),
      longitude: Number(longitude),
      location_name: location_name || 'Bengaluru Street Pin',
      severity: severity || 'Medium',
      incident_time: incident_time || new Date().toISOString(),
      status: 'PENDING',
      rejection_reason: null,
      is_anonymous: is_anonymous !== false ? 1 : 0,
      created_at: new Date().toISOString()
    };
    MEMORY_INCIDENTS.unshift(newInc);
    return res.status(201).json({
      success: true,
      id: newInc.id,
      report_id,
      status: 'PENDING',
      message: 'Incident report submitted for moderator verification.'
    });
  }
});

// 3. GET /api/incidents/track/:reportId — Check report status by tracking ID
app.get('/api/incidents/track/:reportId', async (req, res) => {
  const { reportId } = req.params;
  try {
    const [rows] = await pool.query('SELECT report_id, category, severity, location_name, incident_time, status, rejection_reason, created_at FROM incidents WHERE report_id = ?', [reportId]);
    if (!rows.length) return res.status(404).json({ success: false, error: 'Tracking ID not found' });
    return res.json({ success: true, report: rows[0] });
  } catch (err) {
    const item = MEMORY_INCIDENTS.find(i => i.report_id === reportId);
    if (!item) return res.status(404).json({ success: false, error: 'Tracking ID not found' });
    return res.json({ success: true, report: item });
  }
});

// 4. GET /api/safe-havens — Fetch verified 24/7 Safe Havens in Bengaluru
app.get('/api/safe-havens', async (req, res) => {
  const { type } = req.query;
  try {
    let sql = 'SELECT * FROM safe_havens WHERE is_open_24x7 = TRUE';
    const params = [];
    if (type && type !== 'ALL') {
      sql += ' AND type = ?';
      params.push(type);
    }
    const [rows] = await pool.query(sql, params);
    return res.json({ success: true, safeHavens: rows });
  } catch (err) {
    let filtered = MEMORY_SAFE_HAVENS;
    if (type && type !== 'ALL') {
      filtered = filtered.filter(h => h.type === type);
    }
    return res.json({ success: true, safeHavens: filtered, fallback: true });
  }
});

// 5. POST /api/routes/analyze — Score OSRM routes against verified incident database
app.post('/api/routes/analyze', async (req, res) => {
  try {
    const { routes } = req.body;
    let incidents = MEMORY_INCIDENTS.filter(i => i.status === 'VERIFIED');
    let havens = MEMORY_SAFE_HAVENS;

    try {
      const [dbInc] = await pool.query('SELECT * FROM incidents WHERE status = "VERIFIED"');
      const [dbHav] = await pool.query('SELECT * FROM safe_havens WHERE is_open_24x7 = TRUE');
      if (dbInc && dbInc.length) incidents = dbInc;
      if (dbHav && dbHav.length) havens = dbHav;
    } catch (e) {
      // Use fallback
    }

    const weights = { High: 35, Medium: 18, Low: 8 };
    const scored = (routes || []).map((route, idx) => {
      let riskPenalty = 0;
      const nearbyIncidents = new Map();
      const nearbyHavens = new Map();

      for (const [lat, lng] of (route.coordinates || [])) {
        for (const inc of incidents) {
          const d = haversineMeters(lat, lng, Number(inc.latitude), Number(inc.longitude));
          if (d <= 450 && !nearbyIncidents.has(inc.report_id)) {
            nearbyIncidents.set(inc.report_id, inc);
            riskPenalty += weights[inc.severity] || 15;
          }
        }
        for (const h of havens) {
          const d = haversineMeters(lat, lng, Number(h.latitude), Number(h.longitude));
          if (d <= 400 && !nearbyHavens.has(h.id)) {
            nearbyHavens.set(h.id, h);
          }
        }
      }

      const safetyBonus = Math.min(20, nearbyHavens.size * 5);
      const safetyScore = Math.max(15, Math.min(98, 100 - riskPenalty + safetyBonus));
      return {
        ...route,
        routeIndex: idx,
        riskPenalty,
        safetyScore,
        incidentCount: nearbyIncidents.size,
        havenCount: nearbyHavens.size,
        incidentsEncountered: Array.from(nearbyIncidents.values()),
        havensNearby: Array.from(nearbyHavens.values())
      };
    });

    scored.sort((a, b) => b.safetyScore - a.safetyScore);
    return res.json({ success: true, analyzedRoutes: scored });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/emergency-alerts — Trigger Walk Buddy SOS or 3-Min Inactivity Alert
app.post('/api/emergency-alerts', async (req, res) => {
  const { user_id, user_name, latitude, longitude, reason, contact_name, contact_phone } = req.body;
  let alertId = Date.now();

  try {
    const [result] = await pool.query(
      `INSERT INTO emergency_alerts (user_id, user_name, latitude, longitude, reason, contact_name, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, user_name || 'Commuter', latitude, longitude, reason || 'SOS', contact_name, contact_phone]
    );
    alertId = result.insertId;
  } catch (err) {
    MEMORY_ALERTS.push({ id: alertId, user_name, latitude, longitude, reason, contact_phone, created_at: new Date() });
  }

  const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
  const distressText = `EMERGENCY ALERT from SafeCity Walk Buddy (${reason || 'SOS'}): I need immediate assistance. My live GPS location is ${mapsUrl} (Coords: ${latitude}, ${longitude}).`;
  return res.status(201).json({
    success: true,
    alertId,
    mapsUrl,
    whatsappUrl: `https://wa.me/${String(contact_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(distressText)}`,
    smsUrl: `sms:${contact_phone || ''}?body=${encodeURIComponent(distressText)}`
  });
});

// 7. User Authentication Endpoints
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, emergency_name, emergency_phone, emergency_relation } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long.' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, emergency_name, emergency_phone, emergency_relation)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password, emergency_name || 'Emergency Contact', emergency_phone || '+91 98450 77210', emergency_relation || 'Guardian']
    );
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: result.insertId,
        name,
        email,
        emergency_name: emergency_name || 'Emergency Contact',
        emergency_phone: emergency_phone || '+91 98450 77210',
        emergency_relation: emergency_relation || 'Guardian'
      }
    });
  } catch (err) {
    const existing = MEMORY_USERS.find(u => u.email === email);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }
    const newUser = {
      id: MEMORY_USERS.length + 1,
      name,
      email,
      password,
      emergency_name: emergency_name || 'Emergency Contact',
      emergency_phone: emergency_phone || '+91 98450 77210',
      emergency_relation: emergency_relation || 'Guardian'
    };
    MEMORY_USERS.push(newUser);
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        emergency_name: newUser.emergency_name,
        emergency_phone: newUser.emergency_phone,
        emergency_relation: newUser.emergency_relation
      }
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT id, name, email, password, emergency_name, emergency_phone, emergency_relation FROM users WHERE email = ?', [email]);
    if (!rows.length || rows[0].password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    const user = { ...rows[0] };
    delete user.password;
    return res.json({
      success: true,
      message: 'Authentication successful.',
      token: `usr-jwt-${user.id}-${Date.now()}`,
      user
    });
  } catch (err) {
    const found = MEMORY_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const user = { ...found };
      delete user.password;
      return res.json({
        success: true,
        message: 'Authentication successful.',
        token: `usr-jwt-${user.id}-${Date.now()}`,
        user
      });
    }
    // Allow demo fallback if password meets length
    if (password.length >= 6) {
      return res.json({
        success: true,
        message: 'Authentication successful.',
        token: `usr-jwt-demo-${Date.now()}`,
        user: {
          id: 999,
          name: email.split('@')[0],
          email,
          emergency_name: 'Emergency Contact',
          emergency_phone: '+91 98450 77210',
          emergency_relation: 'Guardian'
        }
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }
  return res.json({ success: true, message: 'If an account exists with this email, password reset instructions have been sent.' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SafeCity Civic API', timestamp: new Date() });
});

// 8. Admin Moderation Endpoints
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if ((email === 'admin@safecity.bengaluru.in' || email === 'admin@astrasafe.bengaluru.in') && (password === 'SafeCity@2026' || password === 'AstraSafe@2026')) {
    return res.json({
      success: true,
      token: 'sc-jwt-moderator-2026-verified',
      admin: { email, role: 'SUPER_MODERATOR', name: 'Bengaluru Safety Command Moderator' }
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid moderator credentials' });
});

app.patch('/api/admin/incidents/:reportId', async (req, res) => {
  const { status, category, severity, rejection_reason } = req.body;
  const { reportId } = req.params;
  try {
    await pool.query(
      `UPDATE incidents SET
        status = COALESCE(?, status),
        category = COALESCE(?, category),
        severity = COALESCE(?, severity),
        rejection_reason = COALESCE(?, rejection_reason)
       WHERE report_id = ?`,
      [status, category, severity, rejection_reason, reportId]
    );
    return res.json({ success: true, reportId, status, category });
  } catch (err) {
    const item = MEMORY_INCIDENTS.find(i => i.report_id === reportId);
    if (item) {
      if (status) item.status = status;
      if (category) item.category = category;
      if (severity) item.severity = severity;
      if (rejection_reason) item.rejection_reason = rejection_reason;
      return res.json({ success: true, reportId, status: item.status, category: item.category });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
});

// SPA wildcard fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  serveFrontend(req, res);
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`SafeCity Backend API listening on port ${PORT}`));
}

module.exports = app;
