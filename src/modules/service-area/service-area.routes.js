const express = require('express');

const router = express.Router();

const { protect } = require('../../middlewares/auth.middleware');

const serviceAreaController =
require('./service-area.controller');

router.use(protect);

router.put(
  '/me/service-area',
  serviceAreaController.updateServiceArea
);

router.get(
  '/me/service-area',
  serviceAreaController.getServiceArea
);

module.exports = router;
