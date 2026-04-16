const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const walkService = require('./walk.service');

const createWalk = asyncHandler(async (req, res) => {
  const walk = await walkService.createWalk(req.user, req.body);

  return res.status(201).json(
    successResponse({
      message: 'Walk created successfully',
      data: walk,
    })
  );
});

const getWalks = asyncHandler(async (req, res) => {
  const walks = await walkService.getWalks(req.user);

  return res.status(200).json(
    successResponse({
      message: 'Walks fetched successfully',
      data: walks,
    })
  );
});

const getWalkById = asyncHandler(async (req, res) => {
  const walk = await walkService.getWalkById(req.user, req.params.walkId);

  return res.status(200).json(
    successResponse({
      message: 'Walk fetched successfully',
      data: walk,
    })
  );
});

module.exports = {
  createWalk,
  getWalks,
  getWalkById,
};