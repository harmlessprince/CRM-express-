const express = require("express");
const AppError = require("../utils/AppError");
const router = express.Router();
const CompanyController = require("./../controllers/CompanyController");
const auth = require("./../middlewares/Protect");
const hasRole = require("./../middlewares/HasRole");
const methodNotAllowed = (req, res, next) => {
    return next(
        new AppError(`The ${req.method} method is not allowed on this route`, 405)
    );
};
router
    .route("/")
    .get(CompanyController.index)
    .post(auth.auth, hasRole.HasRole("admin"), CompanyController.store)
    .all(methodNotAllowed);
router
    .route("/:companyId")
    .get(CompanyController.show)
    .patch(auth.auth,
        hasRole.HasRole("admin"),
        CompanyController.update)
    .delete(auth.auth,
        hasRole.HasRole("admin"),
        CompanyController.delete)
    .all(methodNotAllowed);
module.exports = router;