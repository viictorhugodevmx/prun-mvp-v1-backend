const User = require('../users/user.model');
const AppError = require('../../utils/app-error');
const { ROLES } = require('../../config/constants');

const updateServiceArea = async (user, payload) => {
  if (user.role !== ROLES.PRUNNER) {
    throw new AppError('Only Prunner can configure service area', 403);
  }

  const updatedUser = await User.findByIdAndUpdate(
    user.id,
    {
      serviceLocation: payload.serviceLocation,
      serviceRadiusKm: payload.serviceRadiusKm,
    },
    {
      new: true,
    }
  );

  return updatedUser;
};

const getServiceArea = async (user) => {
  return User.findById(user.id);
};

module.exports = {
  updateServiceArea,
  getServiceArea,
};
