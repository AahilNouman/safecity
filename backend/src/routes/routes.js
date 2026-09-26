const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { apiLimiter } = require('../middleware/rateLimiter');

router.post('/analyze', apiLimiter, routeController.analyzeRoutesHandler);
router.get('/analyze', apiLimiter, routeController.analyzeRoutesHandler);
router.get('/presets', routeController.getPresetsHandler);

module.exports = router;
