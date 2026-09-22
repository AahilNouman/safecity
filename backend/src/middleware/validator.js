const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const validateCreateIncident = [
  body('description')
    .isString().withMessage('Description must be a string')
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category_id')
    .isInt().withMessage('Category ID must be an integer'),
  body('latitude')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('incident_time')
    .optional()
    .isISO8601().withMessage('Incident time must be a valid ISO8601 date'),
  handleValidationErrors
];

const validateAdminLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Must be a valid email'),
  body('password')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateVerifyIncident = [
  handleValidationErrors
];

const validateRejectIncident = [
  body('rejection_reason')
    .isString().withMessage('Rejection reason must be a string')
    .trim()
    .notEmpty().withMessage('Rejection reason is required'),
  handleValidationErrors
];

const validateOverrideCategory = [
  body('new_category')
    .isString().withMessage('New category must be a string')
    .trim()
    .notEmpty().withMessage('New category is required'),
  body('override_reason')
    .isString().withMessage('Override reason must be a string')
    .trim()
    .notEmpty().withMessage('Override reason is required'),
  handleValidationErrors
];

module.exports = {
  validateCreateIncident,
  validateAdminLogin,
  validateVerifyIncident,
  validateRejectIncident,
  validateOverrideCategory
};
