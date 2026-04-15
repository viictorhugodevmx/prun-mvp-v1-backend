const AppError = require('../utils/app-error');

const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('User role not found in request context', 403));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    return next();
  };
};

module.exports = {
  authorize,
};