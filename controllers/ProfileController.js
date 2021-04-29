const AppError = require('../utils/AppError');
const User = require('../models/User');
const CatchAsync = require('../utils/CatchAsync');
const filterFields = require('../utils/FilterFields');
const rejectPasswordUpdate = require("./../utils/RejectPasswordUpdate");

exports.update = CatchAsync(async(req, res, next) => {
    //check if request contains password parameters
    rejectPasswordUpdate(req, res, next);
    //Filter out request parameters
    console.log(req.user.id);
    const filteredBody = filterFields(req.body, "first_name", "last_name", 'phone');
    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    return res.status(200).json({
        status: true,
        message: 'Profile updated successfully',
        user
    });
});


exports.delete = CatchAsync(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { active: false });
    return res.status(204).json({
        status: true,
        message: 'Profile deleted successfully',
        data: null
    });
});