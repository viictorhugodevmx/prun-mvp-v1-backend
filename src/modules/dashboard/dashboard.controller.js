const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const dashboardService = require('./dashboard.service');

const getPrunnerDashboard = asyncHandler(
  async (req, res) => {
    const result =
      await dashboardService.getPrunnerDashboard(
        req.user
      );

    return res.status(200).json(
      successResponse({
        message: 'Dashboard fetched successfully',
        data: result,
      })
    );
  }
);

const getPrownerDashboard = asyncHandler(
  async (req, res) => {
    const result =
      await dashboardService.getPrownerDashboard(
        req.user
      );

    return res.status(200).json(
      successResponse({
        message: 'Dashboard fetched successfully',
        data: result,
      })
    );
  }
);

module.exports = {
  getPrunnerDashboard,
  getPrownerDashboard,
};
