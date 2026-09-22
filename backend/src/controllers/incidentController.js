const db = require('../config/database');
const { generateReportId } = require('../services/reportIdService');
const { classifyIncident } = require('../services/aiService');
const { calculateSeverity } = require('../services/severityService');
const { AppError } = require('../middleware/errorHandler');

const createIncident = async (req, res, next) => {
  try {
    const { description, category_id, latitude, longitude, incident_time } = req.body;
    
    // Generate Report ID
    const public_report_id = await generateReportId();
    
    // Call AI Classification
    let ai_category = null;
    let ai_confidence = 0;
    
    const aiResult = await classifyIncident(description);
    if (aiResult) {
      ai_category = aiResult.category;
      ai_confidence = aiResult.confidence;
    }
    
    // Calculate Severity - density mock for now
    // In a real scenario, we'd query for nearby incidents here
    const { rows: densityRows } = await db.query(
      `SELECT COUNT(*) as cnt FROM incidents 
       WHERE ST_DWithin(location, ST_MakePoint($1, $2)::geography, 500)`,
      [longitude, latitude]
    ).catch(() => ({ rows: [{ cnt: 0 }] })); // graceful fallback if PostGIS not setup yet
    
    const nearbyCount = parseInt(densityRows[0].cnt || 0, 10);
    
    const { severity_score, severity_level } = calculateSeverity(ai_category || category_id, ai_confidence, nearbyCount);
    
    const timeToUse = incident_time || new Date().toISOString();
    
    const insertQuery = `
      INSERT INTO incidents (
        public_report_id, description, category_id, ai_category, ai_confidence, 
        latitude, longitude, incident_time, severity_score, severity_level, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING')
      RETURNING id, public_report_id, status
    `;
    
    const values = [
      public_report_id, description, category_id, ai_category, ai_confidence,
      latitude, longitude, timeToUse, severity_score, severity_level
    ];
    
    const result = await db.query(insertQuery, values);
    
    res.status(201).json({
      success: true,
      data: {
        id: result.rows[0].id,
        public_report_id: result.rows[0].public_report_id,
        status: result.rows[0].status,
        ai_classification: aiResult
      },
      message: 'Incident reported successfully'
    });
  } catch (err) {
    next(err);
  }
};

const getIncidents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, status, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClauses = [];
    let values = [];
    let paramCounter = 1;
    
    if (category) {
      whereClauses.push(`category_id = $${paramCounter++}`);
      values.push(category);
    }
    if (status) {
      whereClauses.push(`status = $${paramCounter++}`);
      values.push(status);
    }
    if (date_from) {
      whereClauses.push(`incident_time >= $${paramCounter++}`);
      values.push(date_from);
    }
    if (date_to) {
      whereClauses.push(`incident_time <= $${paramCounter++}`);
      values.push(date_to);
    }
    
    const whereString = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
    
    const countQuery = `SELECT COUNT(*) FROM incidents ${whereString}`;
    const countResult = await db.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    
    const dataQuery = `
      SELECT id, public_report_id, category_id, final_category, incident_time, status, severity_level 
      FROM incidents 
      ${whereString}
      ORDER BY created_at DESC
      LIMIT $${paramCounter++} OFFSET $${paramCounter++}
    `;
    
    const dataResult = await db.query(dataQuery, [...values, limit, offset]);
    
    res.status(200).json({
      success: true,
      data: dataResult.rows,
      meta: {
        total: totalCount,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

const getIncidentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT id, public_report_id, description, category_id, final_category, ai_category,
             latitude, longitude, incident_time, status, severity_level, created_at
      FROM incidents
      WHERE id::text = $1 OR public_report_id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return next(new AppError('Incident not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

const getMapIncidents = async (req, res, next) => {
  try {
    // Only return verified incidents for public map, with rounded coords
    const query = `
      SELECT 
        public_report_id,
        COALESCE(final_category, ai_category, category_id::text) as display_category,
        ROUND(latitude::numeric, 3) as approx_latitude,
        ROUND(longitude::numeric, 3) as approx_longitude,
        incident_time,
        severity_level
      FROM incidents
      WHERE status = 'VERIFIED'
      ORDER BY incident_time DESC
      LIMIT 1000
    `;
    
    const result = await db.query(query);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

const getHotspots = async (req, res, next) => {
  try {
    // Check if clusters table exists and has data
    const query = `SELECT * FROM clusters WHERE is_active = true`;
    const result = await db.query(query).catch(() => ({ rows: [] }));
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  getMapIncidents,
  getHotspots
};
