const Walk = require('../walks/walk.model');
const Dog = require('../dogs/dog.model');
const User = require('../users/user.model');
const AppError = require('../../utils/app-error');
const { ROLES, WALK_STATUS } = require('../../config/constants');

const getPrunnerDashboard = async (user) => {
  if (user.role !== ROLES.PRUNNER) {
    throw new AppError(
      'Only Prunner can access dashboard',
      403
    );
  }

  const [
    completedWalks,
    activeWalks,
    earnings,
    prunner,
  ] = await Promise.all([
    Walk.countDocuments({
      prunnerId: user.id,
      status: WALK_STATUS.COMPLETED,
    }),
    Walk.countDocuments({
      prunnerId: user.id,
      status: WALK_STATUS.IN_PROGRESS,
    }),
    Walk.find({
      prunnerId: user.id,
      status: WALK_STATUS.COMPLETED,
    }),
    User.findById(user.id),
  ]);

  const totalEarnings = earnings.reduce(
    (sum, walk) => sum + walk.price,
    0
  );

  return {
    completedWalks,
    activeWalks,
    totalEarnings,
    rating: prunner.rating,
    ratingsCount: prunner.ratingsCount,
  };
};

const getPrownerDashboard = async (user) => {
  if (user.role !== ROLES.PROWNER) {
    throw new AppError(
      'Only Prowner can access dashboard',
      403
    );
  }

  const [
    dogs,
    requestedWalks,
    activeWalks,
    completedWalks,
  ] = await Promise.all([
    Dog.countDocuments({
      ownerId: user.id,
    }),

    Walk.countDocuments({
      prownerId: user.id,
      status: WALK_STATUS.REQUESTED,
    }),

    Walk.countDocuments({
      prownerId: user.id,
      status: WALK_STATUS.IN_PROGRESS,
    }),

    Walk.countDocuments({
      prownerId: user.id,
      status: WALK_STATUS.COMPLETED,
    }),
  ]);

  return {
    dogs,
    requestedWalks,
    activeWalks,
    completedWalks,
  };
};

module.exports = {
  getPrunnerDashboard,
  getPrownerDashboard,
};
