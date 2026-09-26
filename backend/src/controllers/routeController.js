const { analyzeRoutes } = require('../services/routeSafetyService');
const { AppError } = require('../middleware/errorHandler');

const analyzeRoutesHandler = async (req, res, next) => {
  try {
    let { origin, destination, mode = 'driving' } = req.body;

    // Also support query params for GET or flat payload
    if (!origin || !destination) {
      const { start_lat, start_lng, end_lat, end_lng, start_name, end_name } = req.body || req.query;
      if (start_lat && start_lng && end_lat && end_lng) {
        origin = {
          lat: parseFloat(start_lat),
          lng: parseFloat(start_lng),
          name: start_name || 'Origin'
        };
        destination = {
          lat: parseFloat(end_lat),
          lng: parseFloat(end_lng),
          name: end_name || 'Destination'
        };
      }
    }

    if (!origin || !destination || isNaN(origin.lat) || isNaN(origin.lng) || isNaN(destination.lat) || isNaN(destination.lng)) {
      return next(new AppError('Valid origin and destination coordinates (lat, lng) are required', 400));
    }

    const result = await analyzeRoutes(origin, destination, mode);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Routes analyzed and scored against verified incident database'
    });
  } catch (err) {
    next(err);
  }
};

const getPresetsHandler = async (req, res, next) => {
  try {
    const presets = [
      {
        id: 'nagawara-shivajinagar',
        title: 'Nagawara ➔ Shivajinagar',
        description: 'Traverses North-Central Bengaluru. Evaluates the Govindpura hotspot corridor vs. safer bypass routes.',
        origin: { lat: 13.0400, lng: 77.6250, name: 'Nagawara Junction, Bengaluru' },
        destination: { lat: 12.9850, lng: 77.6050, name: 'Shivajinagar Bus Station, Bengaluru' }
      },
      {
        id: 'majestic-koramangala',
        title: 'Majestic ➔ Koramangala',
        description: 'Evaluates central transit hub through high-density student & commercial districts.',
        origin: { lat: 12.9770, lng: 77.5720, name: 'Majestic Bus Stand, Bengaluru' },
        destination: { lat: 12.9350, lng: 77.6250, name: 'Koramangala 5th Block, Bengaluru' }
      },
      {
        id: 'indiranagar-electronic-city',
        title: 'Indiranagar ➔ Electronic City',
        description: 'Night transit route from eastern corridor to tech campus zone.',
        origin: { lat: 12.9784, lng: 77.6408, name: '100ft Road, Indiranagar' },
        destination: { lat: 12.8450, lng: 77.6600, name: 'Electronic City Phase 1' }
      }
    ];

    res.status(200).json({
      success: true,
      data: presets
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  analyzeRoutesHandler,
  getPresetsHandler
};
