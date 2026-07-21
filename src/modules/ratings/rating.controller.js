const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const ratingService = require('./rating.service');

const createRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.createRating(
    req.user,
    req.params.walkId,
    req.body
  );

  return res.status(201).json(
    successResponse({
      message: 'Rating created successfully',
      data: rating,
    })
  );
});

const getPrunnerRating = asyncHandler(async (req, res) => {
  const result = await ratingService.getPrunnerRating(
    req.params.prunnerId
  );

  return res.status(200).json(
    successResponse({
      message: 'Prunner rating fetched successfully',
      data: result,
    })
  );
});

module.exports = {
  createRating,
  getPrunnerRating,
};