const { body, param } = require('express-validator');

const walkTypes = ['individual', 'group'];

const createWalkValidation = [
  body('dogIds')
    .isArray({ min: 1 })
    .withMessage('dogIds must be an array with at least one dog id'),

  body('dogIds.*')
    .isMongoId()
    .withMessage('Each dog id must be a valid Mongo id'),

  body('type')
    .isIn(walkTypes)
    .withMessage(`Type must be one of: ${walkTypes.join(', ')}`),

  body('estimatedDuration')
    .isNumeric()
    .withMessage('Estimated duration must be a number'),

  body('price')
    .isNumeric()
    .withMessage('Price must be a number'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
];

const walkIdValidation = [
  param('walkId')
    .isMongoId()
    .withMessage('Invalid walk id'),
];

module.exports = {
  createWalkValidation,
  walkIdValidation,
};