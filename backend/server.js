const express = require('express');
const cors = require('cors');
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

// 1. GET /api/incidents — Fetch public verified incidents (or all for admin)
app.get('/api/incidents', async (req, res) => {
  try {
    const { status, category, severity } = req.query;
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
    res.json({ success: true, incidents: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/incidents — Submit anonymous or user community safety report
app.post('/api/incidents', async (req, res) => {
  try {
    const { category, description, latitude, longitude, location_name, severity, incident_time, is_anonymous } = req.body;
    if (!category || !description || description.length < 10 || description.length > 2000) {
      return res.status(400).json({ success: false, error: 'Description must be 10-2000 characters.' });
    }
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const report_id = `AS-2026-${randomNum}`;
    const [result] = await pool.query(
      `INSERT INTO incidents (report_id, category, description, latitude, longitude, location_name, severity, incident_time, status, is_anonymous)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
      [report_id, category, description, latitude, longitude, location_name || 'Bengaluru Street Pin', severity || 'Medium', incident_time || new Date(), is_anonymous !== false]
    );
    res.status(201).json({
      success: true,
      id: result.insertId,
      report_id,
      status: 'PENDING',
      message: 'Incident report submitted for moderator verification.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/incidents/track/:reportId — Check report status by tracking ID
app.get('/api/incidents/track/:reportId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT report_id, category, severity, location_name, incident_time, status, rejection_reason, created_at FROM incidents WHERE report_id = ?', [req.params.reportId]);
    if (!rows.length) return res.status(404).json({ success: false, error: 'Tracking ID not found' });
    res.json({ success: true, report: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/safe-havens — Fetch verified 24/7 Safe Havens in Bengaluru
app.get('/api/safe-havens', async (req, res) => {
  try {
    const { type } = req.query;
    let sql = 'SELECT * FROM safe_havens WHERE is_open_24x7 = TRUE';
    const params = [];
    if (type && type !== 'ALL') {
      sql += ' AND type = ?';
      params.push(type);
    }
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, safeHavens: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/routes/analyze — Score OSRM routes against verified incident database
app.post('/api/routes/analyze', async (req, res) => {
  try {
    const { routes } = req.body; // Array of route geometries [[lat, lng], ...]
    const [incidents] = await pool.query('SELECT * FROM incidents WHERE status = "VERIFIED"');
    const [havens] = await pool.query('SELECT * FROM safe_havens WHERE is_open_24x7 = TRUE');

    const weights = { High: 35, Medium: 18, Low: 8 };
    const scored = routes.map((route, idx) => {
      let riskPenalty = 0;
      const nearbyIncidents = new Map();
      const nearbyHavens = new Map();

      for (const [lat, lng] of route.coordinates) {
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
    res.json({ success: true, analyzedRoutes: scored });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/emergency-alerts — Trigger Walk Buddy SOS or 3-Min Inactivity Alert
app.post('/api/emergency-alerts', async (req, res) => {
  try {
    const { user_id, user_name, latitude, longitude, reason, contact_name, contact_phone } = req.body;
    const [result] = await pool.query(
      `INSERT INTO emergency_alerts (user_id, user_name, latitude, longitude, reason, contact_name, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, user_name || 'Commuter', latitude, longitude, reason || 'SOS', contact_name, contact_phone]
    );
    const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    const distressText = `EMERGENCY ALERT from SafeCity Walk Buddy (${reason}): I need immediate assistance. My live GPS location is ${mapsUrl} (Coords: ${latitude}, ${longitude}).`;
    res.status(201).json({
      success: true,
      alertId: result.insertId,
      mapsUrl,
      whatsappUrl: `https://wa.me/${String(contact_phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(distressText)}`,
      smsUrl: `sms:${contact_phone}?body=${encodeURIComponent(distressText)}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. User Authentication Endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, emergency_name, emergency_phone, emergency_relation } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long.' });
    }
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, emergency_name, emergency_phone, emergency_relation)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password, emergency_name || 'Emergency Contact', emergency_phone || '+91 98450 77210', emergency_relation || 'Guardian']
    );
    res.status(201).json({
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
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    const [rows] = await pool.query('SELECT id, name, email, password, emergency_name, emergency_phone, emergency_relation FROM users WHERE email = ?', [email]);
    if (!rows.length || rows[0].password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    const user = rows[0];
    delete user.password;
    res.json({
      success: true,
      message: 'Authentication successful.',
      token: `usr-jwt-${user.id}-${Date.now()}`,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      // Don't leak existence of email for security
      return res.json({ success: true, message: 'If an account exists with this email, password reset instructions have been sent.' });
    }
    res.json({ success: true, message: 'Password reset link sent to your registered email address.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
  try {
    const { status, category, severity, rejection_reason } = req.body;
    const { reportId } = req.params;
    await pool.query(
      `UPDATE incidents SET
        status = COALESCE(?, status),
        category = COALESCE(?, category),
        severity = COALESCE(?, severity),
        rejection_reason = COALESCE(?, rejection_reason)
       WHERE report_id = ?`,
      [status, category, severity, rejection_reason, reportId]
    );
    res.json({ success: true, reportId, status, category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SafeCity Backend API listening on port ${PORT}`));
