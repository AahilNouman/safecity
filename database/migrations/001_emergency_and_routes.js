const db = require('../../backend/src/config/database');

async function run() {
  console.log('Running database migration for Emergency Contact & Safest Route Hotspots...');
  
  try {
    // 1. Add emergency contact columns to users if missing
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS emergency_contact_relationship VARCHAR(100);
    `);
    console.log('✓ Users table columns checked & updated.');

    // 2. Create emergency_alerts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS emergency_alerts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        alert_type VARCHAR(50) NOT NULL,
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        address TEXT,
        contact_name VARCHAR(255),
        contact_phone VARCHAR(50),
        contact_relationship VARCHAR(100),
        status VARCHAR(50) DEFAULT 'TRIGGERED',
        session_duration_seconds INTEGER DEFAULT 0,
        details JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        resolved_at TIMESTAMPTZ
      );
    `);
    console.log('✓ Emergency alerts table verified.');

    // 3. Check if Govindpura cluster exists
    const clusterCheck = await db.query("SELECT id FROM clusters WHERE primary_category ILIKE '%Govindpura%' OR id = 4");
    if (clusterCheck.rows.length === 0) {
      // Add Govindpura cluster (Cluster 4: 13.015, 77.618 - between Nagawara and Shivajinagar)
      await db.query(`
        INSERT INTO clusters (
          cluster_label, centroid_lat, centroid_lng, incident_count, primary_category, 
          avg_severity, radius_meters, is_active, computed_at
        ) VALUES (
          4, 13.01500000, 77.61800000, 8, 'Harassment / Poor Lighting (Govindpura)', 
          0.82, 650.00, true, NOW()
        );
      `);
      console.log('✓ Govindpura cluster 4 added.');

      // Add 8 realistic incidents in Govindpura area
      const govindpuraIncidents = [
        { desc: 'Verbal harassment and stalking near Govindpura bus stop after dark with broken streetlights', lat: 13.0152, lng: 77.6178, sev: 0.85, cat: 1 },
        { desc: 'Group of men loitering and passing obscene comments along Govindpura Main Road', lat: 13.0145, lng: 77.6185, sev: 0.80, cat: 1 },
        { desc: 'Complete street lighting failure between Govindpura cross and Nagawara junction', lat: 13.0160, lng: 77.6172, sev: 0.70, cat: 5 },
        { desc: 'Two men on motorbike following a woman walking towards Tannery Road', lat: 13.0138, lng: 77.6190, sev: 0.88, cat: 2 },
        { desc: 'Threatening behavior and aggressive whistling near abandoned warehouse Govindpura', lat: 13.0158, lng: 77.6165, sev: 0.82, cat: 3 },
        { desc: 'Unsafe secluded passage with zero surveillance under Govindpura railway underpass', lat: 13.0140, lng: 77.6170, sev: 0.78, cat: 4 },
        { desc: 'Intimidating loitering and harassment of night shift nurses returning from clinic', lat: 13.0165, lng: 77.6182, sev: 0.86, cat: 1 },
        { desc: 'Suspicious vehicle tailing pedestrians on poorly lit lane in Govindpura', lat: 13.0148, lng: 77.6195, sev: 0.75, cat: 6 }
      ];

      for (const inc of govindpuraIncidents) {
        await db.query(`
          INSERT INTO incidents (
            category_id, description, latitude, longitude, incident_time,
            ai_category, ai_confidence, severity_score, severity_level,
            verification_status, verified_at, final_category
          ) VALUES (
            $1, $2, $3, $4, NOW() - interval '2 days',
            'Harassment', 0.91, $5, 'HIGH',
            'VERIFIED', NOW(), 'Harassment'
          )
        `, [inc.cat, inc.desc, inc.lat, inc.lng, inc.sev]);
      }
      console.log('✓ Govindpura verified incidents inserted.');
    } else {
      console.log('✓ Govindpura cluster already present.');
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
