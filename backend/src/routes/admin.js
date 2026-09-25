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
// Support both PATCH and PUT for verify
router.route('/incidents/:id/verify')
  .patch(validateVerifyIncident, adminController.verifyIncident)
  .put(validateVerifyIncident, adminController.verifyIncident);

// Support both PATCH and PUT for reject
router.route('/incidents/:id/reject')
  .patch(validateRejectIncident, adminController.rejectIncident)
  .put(validateRejectIncident, adminController.rejectIncident);

// Support both PATCH and PUT, and both /category and /override paths
router.route(['/incidents/:id/category', '/incidents/:id/override'])
  .patch(validateOverrideCategory, adminController.overrideCategory)
  .put(validateOverrideCategory, adminController.overrideCategory);

module.exports = router;
