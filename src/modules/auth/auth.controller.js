const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  return res.status(201).json(
    successResponse({
      message: 'User registered successfully',
      data: result,
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  return res.status(200).json(
    successResponse({
      message: 'Login successful',
      data: result,
    })
  );
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  return res.status(200).json(
    successResponse({
      message: 'Authenticated user fetched successfully',
      data: user,
    })
  );
});

module.exports = {
  register,
  login,
  me,
};