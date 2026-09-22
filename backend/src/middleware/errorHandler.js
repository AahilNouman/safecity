class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
    console.error('CRITICAL ERROR:', err);
  } else {
    statusCode = statusCode || 500;
  }

  const response = {
    success: false,
    error: message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { AppError, errorHandler };
