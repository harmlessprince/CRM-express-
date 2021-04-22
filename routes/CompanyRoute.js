const express = require('express');
const AppError = require('../utils/AppError');
const router = express.Router();
const CompanyController = require("./../controllers/CompanyController");
const methodNotAllowed = (req, res, next) => {
    return next(new AppError(`The ${req.method} method is not allowed on this route`, 405))
};
router.route('/').get(CompanyController.index).post(CompanyController.store).all(methodNotAllowed);;
router.route('/:companyId').get(CompanyController.show).patch(CompanyController.update).delete(CompanyController.delete).all(methodNotAllowed);
module.exports = router;