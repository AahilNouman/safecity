const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');
const { 
  validateAdminLogin, 
  validateVerifyIncident,
  validateRejectIncident,
  validateOverrideCategory
} = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, validateAdminLogin, adminController.login);

router.use(verifyToken);

router.get('/dashboard', adminController.getDashboard);
router.get('/incidents', adminController.getAdminIncidents);
router.patch('/incidents/:id/verify', validateVerifyIncident, adminController.verifyIncident);
router.patch('/incidents/:id/reject', validateRejectIncident, adminController.rejectIncident);
router.patch('/incidents/:id/category', validateOverrideCategory, adminController.overrideCategory);

module.exports = router;
