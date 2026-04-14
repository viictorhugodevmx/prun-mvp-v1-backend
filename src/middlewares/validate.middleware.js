const { validationResult } = require('express-validator');
const AppError = require('../utils/app-error');

const validateMiddleware = (req, _res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return next(
    new AppError('Validation failed', 422, errors.array())
  );
};

module.exports = validateMiddleware;