const AppError = require('../utils/AppError');
const Employee = require('../models/Employee');
const CatchAsync = require('./../utils/CatchAsync');
const filterFields = require('./../utils/FilterFields');
const NotFoundError = function(req, res, next) {
    return next(new AppError(`Employee with id: ${req.params.employeeId} not found`, 404));
};
exports.index = CatchAsync(async(req, res, next) => {
    const employees = await Employee.find();
    return res.status(200).json({
        status: true,
        message: 'success',
        data: {
            employees
        }
    });
});


exports.store = CatchAsync(async(req, res, next) => {
    const employee = await Employee.create(req.body);
    employee.password = undefined;
    res.status(201).json({
        status: true,
        message: 'success',
        data: {
            employee,
        }
    });
});

exports.show = CatchAsync(async(req, res, next) => {
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) return NotFoundError(req, res, next);
    res.status(302).json({
        status: true,
        message: 'success',
        data: {
            employee,
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
    //update employee details
    const employee = await Employee.findByIdAndUpdate(req.params.employeeId, filteredBody, { new: true, runValidators: true });
    if (!employee) return NotFoundError(req, res, next);
    res.status(200).json({
        status: true,
        'messages': 'profile updated successfully',
        data: { employee }
    });
});

exports.delete = CatchAsync(async(req, res, next) => {
    const user = await Employee.findById(req.params.employeeId);
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
        messages: 'Employee deleted successfully ',
        data: null
    });
});
exports.create = CatchAsync((req, res, next) => {
    res.status(204).json({
        'all': 'ok'
    });
});