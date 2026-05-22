const { body, param } = require('express-validator');

const addPhotoValidation = [
  body('photoUrl')
    .trim()
    .notEmpty()
    .withMessage('photoUrl is required'),

  body('caption')
    .optional({ nullable: true })
    .isString()
    .withMessage('Caption must be a string'),
];

const walkIdValidation = [
  param('walkId')
    .isMongoId()
    .withMessage('Invalid walk id'),
];

module.exports = {
  addPhotoValidation,
  walkIdValidation,
};