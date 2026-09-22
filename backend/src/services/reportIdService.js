const db = require('../config/database');

const generateReportId = async () => {
  let isUnique = false;
  let reportId = '';
  
  while (!isUnique) {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    reportId = `SC-${year}-${randomDigits}`;
    
    try {
      const result = await db.query('SELECT id FROM incidents WHERE public_report_id = $1', [reportId]);
      if (result.rows.length === 0) {
        isUnique = true;
      }
    } catch (err) {
      console.error('Error checking report ID uniqueness', err);
      throw new Error('Failed to generate unique report ID');
    }
  }
  
  return reportId;
};

module.exports = {
  generateReportId
};
