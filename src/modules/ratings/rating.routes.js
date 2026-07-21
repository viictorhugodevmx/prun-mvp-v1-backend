const express = require('express');
const router = express.Router();

const { protect } = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');

const ratingController = require('./rating.controller');

const {
  createRatingValidation,
  walkIdValidation,
  prunnerIdValidation,
} = require('./rating.validation');

router.post(
  '/walks/:walkId/rating',
  protect,
  walkIdValidation,
  createRatingValidation,
  validateMiddleware,
  ratingController.createRating
);

router.get(
  '/prunners/:prunnerId/rating',
  protect,
  prunnerIdValidation,
  validateMiddleware,
  ratingController.getPrunnerRating
);

module.exports = router;