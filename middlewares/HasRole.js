const AppError = require("./../utils/AppError");
const CatchAsync = require('./../utils/CatchAsync');
// console.log(roles.can());
exports.HasRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Access denied!, you are not allowed to perform this operation', 401));
        }
        next();
    }
}