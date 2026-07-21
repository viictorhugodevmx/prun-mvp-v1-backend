const Rating = require('./rating.model');
const Walk = require('../walks/walk.model');
const User = require('../users/user.model');
const AppError = require('../../utils/app-error');
const { ROLES, WALK_STATUS } = require('../../config/constants');

const createRating = async (user, walkId, payload) => {
  if (user.role !== ROLES.PROWNER) {
    throw new AppError('Only Prowner can rate walks', 403);
  }

  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  if (walk.prownerId.toString() !== user.id) {
    throw new AppError('Walk not found', 404);
  }

  if (walk.status !== WALK_STATUS.COMPLETED) {
    throw new AppError('Walk must be completed before rating', 422);
  }

  const existing = await Rating.findOne({ walkId });

  if (existing) {
    throw new AppError('Walk already rated', 422);
  }

  const rating = await Rating.create({
    walkId,
    prownerId: user.id,
    prunnerId: walk.prunnerId,
    score: payload.score,
    comment: payload.comment ?? null,
  });

  const prunner = await User.findById(walk.prunnerId);

  prunner.totalRatings += payload.score;
  prunner.ratingsCount += 1;
  prunner.rating =
    prunner.totalRatings / prunner.ratingsCount;

  await prunner.save();

  return rating;
};

const getPrunnerRating = async (prunnerId) => {
  const prunner = await User.findById(prunnerId);

  if (!prunner) {
    throw new AppError('Prunner not found', 404);
  }

  return {
    prunnerId: prunner._id,
    rating: prunner.rating,
    ratingsCount: prunner.ratingsCount,
  };
};

module.exports = {
  createRating,
  getPrunnerRating,
};