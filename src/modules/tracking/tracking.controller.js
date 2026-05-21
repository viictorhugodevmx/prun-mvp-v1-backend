const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const trackingService = require('./tracking.service');

const addTrackingPoint = asyncHandler(async (req, res) => {
  const point = await trackingService.addTrackingPoint(
    req.user,
    req.params.walkId,
    req.body
  );

  return res.status(201).json(
    successResponse({
      message: 'Tracking point added',
      data: point,
    })
  );
});

const getTracking = asyncHandler(async (req, res) => {
  const points = await trackingService.getTrackingByWalk(
    req.user,
    req.params.walkId
  );

  return res.status(200).json(
    successResponse({
      message: 'Tracking fetched successfully',
      data: points,
    })
  );
});

module.exports = {
  addTrackingPoint,
  getTracking,
};