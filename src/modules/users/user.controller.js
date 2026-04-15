const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const userService = require('./user.service');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);

  return res.status(200).json(
    successResponse({
      message: 'User profile fetched successfully',
      data: user,
    })
  );
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user.id, req.body);

  return res.status(200).json(
    successResponse({
      message: 'User profile updated successfully',
      data: user,
    })
  );
});

module.exports = {
  getMe,
  updateMe,
};