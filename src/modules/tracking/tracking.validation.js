const { body, param } = require('express-validator');

const addTrackingValidation = [
  body('lat').isNumeric().withMessage('Latitude must be a number'),
  body('lng').isNumeric().withMessage('Longitude must be a number'),
  body('timestamp').isNumeric().withMessage('Timestamp must be a number'),
];

const walkIdValidation = [
  param('walkId').isMongoId().withMessage('Invalid walk id'),
];

module.exports = {
  addTrackingValidation,
  walkIdValidation,
};