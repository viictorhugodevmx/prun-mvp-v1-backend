const express = require('express');
const authController = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validation');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post(
  '/register',
  registerValidation,
  validateMiddleware,
  authController.register
);

router.post(
  '/login',
  loginValidation,
  validateMiddleware,
  authController.login
);

router.get(
  '/me',
  protect,
  authController.me
);

module.exports = router;