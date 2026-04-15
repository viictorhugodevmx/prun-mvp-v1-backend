const User = require('../users/user.model');
const AppError = require('../../utils/app-error');
const { hashPassword, comparePassword } = require('../../utils/password');
const { signToken } = require('../../utils/jwt');

const { sanitizeUser } = require('../users/user.utils');

const register = async ({ name, email, phone, password, role }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError('Email is already in use', 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    password: hashedPassword,
    role,
  });

  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
};

module.exports = {
  register,
  login,
  getCurrentUser,
};