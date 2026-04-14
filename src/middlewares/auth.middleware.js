const User = require('../modules/users/user.model');
const AppError = require('../utils/app-error');
const { verifyToken } = require('../utils/jwt');

const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authorization token is required', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.sub);

    if (!user) {
      return next(new AppError('User associated with this token no longer exists', 401));
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      status: user.status,
    };

    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = {
  protect,
};