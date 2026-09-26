const express = require('express');
const router = express.Router();
const safetyController = require('../controllers/safetyController');
const { verifyToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Allow anonymous/guest or authenticated SOS alerts
router.post('/emergency-alert', apiLimiter, (req, res, next) => {
  // Try to authenticate if header present, but don't reject if not
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyToken(req, res, () => safetyController.triggerEmergencyAlert(req, res, next));
  }
  return safetyController.triggerEmergencyAlert(req, res, next);
});

router.patch('/alerts/:id/resolve', verifyToken, safetyController.resolveEmergencyAlert);
router.get('/alerts', verifyToken, safetyController.getAlerts);

module.exports = router;
