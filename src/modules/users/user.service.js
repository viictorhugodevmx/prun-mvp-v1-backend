const User = require('./user.model');
const AppError = require('../../utils/app-error');
const { sanitizeUser } = require('./user.utils');

const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
};

const updateMe = async (userId, payload) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const allowedFields = ['name', 'phone', 'photo'];

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      user[field] = payload[field];
    }
  });

  await user.save();

  return sanitizeUser(user);
};

module.exports = {
  getMe,
  updateMe,
};