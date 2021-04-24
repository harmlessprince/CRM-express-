const AppError = require('./../utils/AppError');
const Company = require('../models/Company');
const CatchAsync = require('./../utils/CatchAsync');
const Employee = require('../models/Employee');

exports.index = CatchAsync(async(req, res, next) => {
    const companies = await Company.find();

    return res.status(200).json({
        status: true,
        message: 'success',
        data: {
            companies,
        }
    });
});

exports.store = CatchAsync(async(req, res, next) => {
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
    const company = await Company.findById(req.params.companyId);
    let companyEmployees = await Employee.find({ "company": company._id }).select('first_name last_name').populate("-company");
    company.employees = companyEmployees;
    if (!company) {
        return next(new AppError(`No Company found with the ID : ${req.params.companyId}`, 404))
    }
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