const express = require('express');
const trackingController = require('./tracking.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const {
  addTrackingValidation,
  walkIdValidation,
} = require('./tracking.validation');

const router = express.Router();

router.use(protect);

router.post(
  '/:walkId/tracking',
  walkIdValidation,
  addTrackingValidation,
  validateMiddleware,
  trackingController.addTrackingPoint
);

router.get(
  '/:walkId/tracking',
  walkIdValidation,
  validateMiddleware,
  trackingController.getTracking
);

module.exports = router;