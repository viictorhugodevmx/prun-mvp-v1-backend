const express = require('express');
const userController = require('./user.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { updateMeValidation } = require('./user.validation');

const router = express.Router();

router.get('/me', protect, userController.getMe);

router.put('/me', protect, updateMeValidation, validateMiddleware, userController.updateMe);

module.exports = router;