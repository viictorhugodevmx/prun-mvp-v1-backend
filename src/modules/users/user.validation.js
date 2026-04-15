const { body } = require('express-validator');

const updateMeValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),

  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone cannot be empty'),

  body('photo')
    .optional({ nullable: true })
    .isString()
    .withMessage('Photo must be a string or null'),
];

module.exports = {
  updateMeValidation,
};