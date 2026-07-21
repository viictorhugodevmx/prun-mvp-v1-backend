const express = require('express');

const router = express.Router();

const { protect } = require('../../middlewares/auth.middleware');

const dashboardController =
require('./dashboard.controller');

router.get(
  '/prunner',
  protect,
  dashboardController.getPrunnerDashboard
);

module.exports = router;
