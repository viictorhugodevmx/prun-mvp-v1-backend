const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const serviceAreaService = require('./service-area.service');

const updateServiceArea = asyncHandler(async (req, res) => {
  const result =
    await serviceAreaService.updateServiceArea(
      req.user,
      req.body
    );

  return res.status(200).json(
    successResponse({
      message: 'Service area updated successfully',
      data: result,
    })
  );
});

const getServiceArea = asyncHandler(async (req, res) => {
  const result =
    await serviceAreaService.getServiceArea(req.user);

  return res.status(200).json(
    successResponse({
      message: 'Service area fetched successfully',
      data: result,
    })
  );
});

module.exports = {
  updateServiceArea,
  getServiceArea,
};
