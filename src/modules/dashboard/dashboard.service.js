const Walk = require('../walks/walk.model');
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

module.exports = {
  getPrunnerDashboard,
};
