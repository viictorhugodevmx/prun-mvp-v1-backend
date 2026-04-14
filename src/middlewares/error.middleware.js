const { errorResponse } = require('../utils/api-response');

const errorMiddleware = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const errors = err.errors || null;

  return res.status(statusCode).json(
    errorResponse({
      message,
      errors,
    })
  );
};

module.exports = errorMiddleware;