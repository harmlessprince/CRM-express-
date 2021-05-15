const AppError = require('./../utils/AppError');
const Company = require('../models/Company');
const CatchAsync = require('./../utils/CatchAsync');
const User = require('../models/User');

exports.index = CatchAsync(async(req, res, next) => {
    const companies = await Company.find().populate('total_employees');;

    return res.status(200).json({
        status: true,
        message: 'success',
        data: {
            companies,
        }
    });
});

exports.store = CatchAsync(async(req, res, next) => {
    //check if does not company exist
    const ownerID = req.body.owner;
    if (!(await User.exists({ _id: ownerID }))) {
        return next(new AppError(`Their is no user with the ID: ${req.body.owner}`, 404));
    }
    const ownerProfile = await User.findOne({ _id: ownerID }).select('role');
    if (ownerProfile.role === 'employee' || ownerProfile.role === 'admin') {
        return next(new AppError(`Selected owner can not be of type admin or employee: ${req.body.owner}`, 422));
    }
    const company = await Company.create(req.body);
    res.status(201).json({
        status: true,
        message: 'success',
        data: {
            company,
        }
    });
});

exports.show = CatchAsync(async(req, res, next) => {
    const company = await Company.find({ _id: req.params.companyId }).populate({ path: 'employees', select: 'first_name last_name email -company' }).populate('total_employees');
    if (!company) {
        return next(new AppError(`No Company found with the ID : ${req.params.companyId}`, 404))
    }
    // let companyUsers = await User.find({ "company": company._id }).select('first_name last_name').populate("-company");
    // company.users = companyUsers;
    res.status(200).json({
        status: true,
        message: 'success',
        data: {
            company,
        }
    });
});

exports.update = CatchAsync(async(req, res, next) => {

    const company = await Company.findByIdAndUpdate(req.params.companyId, req.body, { new: true, runValidators: true });
    res.status(200).json({
        status: true,
        message: 'success',
        data: {
            company,
        }
    });
});

exports.delete = CatchAsync(async(req, res, next) => {
    await Company.findByIdAndDelete(req.params.companyId)
    res.status(204).json({
        status: true,
        message: 'success',
        data: null
    });
});
exports.create = CatchAsync((req, res, next) => {
    res.status(200).json({
        status: true,
        message: 'success',
        data: null
    });
});