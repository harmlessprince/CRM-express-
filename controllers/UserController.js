const AppError = require('../utils/AppError');
const User = require('../models/User');
const CatchAsync = require('../utils/CatchAsync');
const filterFields = require('../utils/FilterFields');
const NotFoundError = function(req, res, next) {
    return next(new AppError(`User or User with id: ${req.params.userId} not found`, 404));
};
exports.index = CatchAsync(async(req, res, next) => {
    const users = await User.find();
    return res.status(200).json({
        status: true,
        message: 'success',
        data: {
            users
        }
    });
});


exports.store = CatchAsync(async(req, res, next) => {
    const user = await User.create(req.body);
    user.password = undefined;
    res.status(201).json({
        status: true,
        message: 'success',
        data: {
            user,
        }
    });
});

exports.show = CatchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) return NotFoundError(req, res, next);
    res.status(302).json({
        status: true,
        message: 'success',
        data: {
            user,
        }
    });
});

exports.update = CatchAsync(async(req, res, next) => {
    //check if req has password parameters
    if (req.body.password || req.body.confirm_password) {
        return next(new AppError('You are not allowed to update you password via this route', 403))
    }
    //Filter out request parameters
    const filteredBody = filterFields(req.body, "first_name", "last_name", 'phone', 'updated_at');
    //update user details
    const userId = req.params.userId || req.user.id
    const user = await User.findByIdAndUpdate(req.params.userId, filteredBody, { new: true, runValidators: true });
    if (!user) return NotFoundError(req, res, next);
    res.status(200).json({
        status: true,
        'messages': 'profile updated successfully',
        data: { user }
    });
});

exports.delete = CatchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return NotFoundError(req, res, next);
    }
    if (user.role === 'admin') {
        return next(new AppError('This user can not be deleted, he is the super admin'));
    }
    user.active = false;
    user.save({ validateBeforeSave: false });
    res.status(204).json({
        status: true,
        messages: 'User deleted successfully ',
        data: null
    });
});
exports.create = CatchAsync((req, res, next) => {
    res.status(204).json({
        'all': 'ok'
    });
});