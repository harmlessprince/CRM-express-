const express = require("express");
const router = express.Router();
const EmployeeController = require("./../controllers/EmployeeController");
const auth = require("./../middlewares/Protect");
const hasRole = require("./../middlewares/HasRole");
router
    .route("/")
    .get(auth.auth,
        hasRole.HasRole("company", "admin"),
        EmployeeController.index)
    .post(
        auth.auth,
        hasRole.HasRole("company", "admin"),
        EmployeeController.store
    );
router
    .route("/:employeeId")
    .get(auth.auth, hasRole.HasRole("employee"), EmployeeController.show)
    .patch(auth.auth, EmployeeController.update)
    .delete(auth.auth, hasRole.HasRole("admin", "company"), EmployeeController.delete);
module.exports = router;