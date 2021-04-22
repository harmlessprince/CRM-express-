const AppError = require("../utils/AppError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400);
}
const handleDuplicateFieldDB = (err) => {
    const message = `Duplicate field value: ${err.keyValue.email}. Please use another value`
    return new AppError(message, 400);
}
const handleValidationErrorDB = (err) => {
    console.log(err);
    const errors = Object.values(err.errors).map(el => el);
    // console.log(errors);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}
const handleConfirmPasswordDB = (err) => {
    const message = `Confirm password should be same with password`
    return new AppError(message, 400);
}
const handleJWTError = err => new AppError('Invalid token, Please log in again', 401)
const handleTokenExpiredError = err => new AppError('Token has expired!, Please log in again', 401);
const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (res, err) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    //log error
    console.error('Error: ', err);
    //Send generic error
    return res.status(err.statusCode).json({
        status: false,
        message: 'Whoops!, something went wrong',
    });
};
//Global Erro handling middleware
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || false;
    if (process.env.NODE_ENV === "development") {
        // if (err.name == "ValidationError") err = handleCastValidationErrorDB(err);
        sendErrorDev(res, err);

    } else if (process.env.NODE_ENV === "production") {
        let error = {...err };
        if (error.kind == "ObjectId") error = handleCastErrorDB(error);
        if (error.code == 11000) error = handleDuplicateFieldDB(error);
        if (error.name == 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name == 'TokenExpiredError') error = handleTokenExpiredError(error);
        if (error.name == "ValidatorError") error = handleValidationErrorDB(error);
        // if (Object.values(error.errors)[0]['name'] == "ValidatorError") error = handleValidationErrorDB(error);
        sendErrorProd(res, error);
    }
};