const db = require('./src/config/database');

async function seedClusters() {
  try {
    await db.query(`
      INSERT INTO clusters (cluster_label, centroid_lat, centroid_lng, incident_count, primary_category, avg_severity, radius_meters, is_active)
      VALUES 
        (1, 12.9770, 77.5720, 14, 'Harassment', 0.82, 650, true),
        (2, 12.9350, 77.6250, 18, 'Stalking', 0.75, 520, true),
        (3, 12.8450, 77.6600, 11, 'Poor Lighting', 0.68, 780, true)
    `);
    console.log('✅ Demo clusters seeded successfully!');
  } catch (err) {
    console.error('Cluster seed error:', err.message);
  } finally {
    process.exit(0);
  }
}

seedClusters();
