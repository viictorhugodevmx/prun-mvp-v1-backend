const { body, param } = require('express-validator');

const createRatingValidation = [
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Score must be between 1 and 5'),

  body('comment')
    .optional({ nullable: true })
    .isString(),
];

const walkIdValidation = [
  param('walkId')
    .isMongoId()
    .withMessage('Invalid walk id'),
];

const prunnerIdValidation = [
  param('prunnerId')
    .isMongoId()
    .withMessage('Invalid prunner id'),
];

module.exports = {
  createRatingValidation,
  walkIdValidation,
  prunnerIdValidation,
};