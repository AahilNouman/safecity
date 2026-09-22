const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { validateCreateIncident } = require('../middleware/validator');
const { apiLimiter } = require('../middleware/rateLimiter');

router.post('/', apiLimiter, validateCreateIncident, incidentController.createIncident);
router.get('/', incidentController.getIncidents);
router.get('/map', incidentController.getMapIncidents);
router.get('/hotspots', incidentController.getHotspots);
router.get('/:id', incidentController.getIncidentById);

module.exports = router;
