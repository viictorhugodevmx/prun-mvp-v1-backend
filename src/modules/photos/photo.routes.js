const express = require('express');
const photoController = require('./photo.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validateMiddleware = require('../../middlewares/validate.middleware');
const {
  addPhotoValidation,
  walkIdValidation,
} = require('./photo.validation');

const router = express.Router();

router.use(protect);

router.post(
  '/:walkId/photos',
  walkIdValidation,
  addPhotoValidation,
  validateMiddleware,
  photoController.addPhoto
);

router.get(
  '/:walkId/photos',
  walkIdValidation,
  validateMiddleware,
  photoController.getWalkPhotos
);

module.exports = router;