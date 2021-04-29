const AppError = require('../utils/AppError');
const User = require('../models/User');
const CatchAsync = require('../utils/CatchAsync');
const filterFields = require('../utils/FilterFields');

exports.update = CatchAsync(async(req, res, next) => {
    console.log(req.user);
    // next();
});