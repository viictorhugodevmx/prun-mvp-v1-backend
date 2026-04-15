const { body, param } = require('express-validator');

const dogSizes = ['small', 'medium', 'large'];

const createDogValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('age')
    .isNumeric()
    .withMessage('Age must be a number'),

  body('size')
    .isIn(dogSizes)
    .withMessage(`Size must be one of: ${dogSizes.join(', ')}`),

  body('breed')
    .optional({ nullable: true })
    .isString()
    .withMessage('Breed must be a string'),

  body('photo')
    .optional({ nullable: true })
    .isString()
    .withMessage('Photo must be a string or null'),

  body('notes')
    .optional({ nullable: true })
    .isString()
    .withMessage('Notes must be a string'),
];

const updateDogValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),

  body('age')
    .optional()
    .isNumeric()
    .withMessage('Age must be a number'),

  body('size')
    .optional()
    .isIn(dogSizes)
    .withMessage(`Size must be one of: ${dogSizes.join(', ')}`),

  body('breed')
    .optional({ nullable: true })
    .isString()
    .withMessage('Breed must be a string'),

  body('photo')
    .optional({ nullable: true })
    .isString()
    .withMessage('Photo must be a string or null'),

  body('notes')
    .optional({ nullable: true })
    .isString()
    .withMessage('Notes must be a string'),
];

const dogIdValidation = [
  param('dogId')
    .isMongoId()
    .withMessage('Invalid dog id'),
];

module.exports = {
  createDogValidation,
  updateDogValidation,
  dogIdValidation,
};