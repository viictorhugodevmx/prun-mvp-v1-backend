const successResponse = ({ message = 'Success', data = null } = {}) => {
  return {
    success: true,
    message,
    data,
  };
};

const errorResponse = ({ message = 'Something went wrong', errors = null } = {}) => {
  return {
    success: false,
    message,
    errors,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};