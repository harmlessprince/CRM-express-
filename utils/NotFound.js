const AppError = require('./AppError');
module.exports = (req, res, next) => {
    return next(new AppError(`User or User with id: ${req.params.userId} not found`, 404));
};