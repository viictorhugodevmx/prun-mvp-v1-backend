const { body } = require('express-validator');
const { ROLES } = require('../../config/constants');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
};