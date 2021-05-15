const AppError = require('./AppError');
module.exports = (req, res, next) => {
    if (req.body.password || req.body.confirm_password) {
        return next(new AppError('You are not allowed to update you password via this route', 403))
    }
}