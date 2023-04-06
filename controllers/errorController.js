const AppError = require('../Utils/appError');

const sendErrorProd = (err, res) => {
  //operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message);
};
const handleDuplicateFieldsDB = (err, msg) => {
  const value = msg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate Field Value: ${value}. Please use another Value`;
  return new AppError(message, 400);
};
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid inout data ${errors.join('. ')}`;
  return new AppError(message, 400);
};
//we are giving more error details as it is development
const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    console.log(process.env.NODE_DEV);
    let error = { ...err };
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error, err.errmsg);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationError(err);
    }
    sendErrorProd(error, res);
  }
  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: `${err.message} message further appended in error Controller`,
  // });
};
