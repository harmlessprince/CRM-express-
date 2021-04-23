const express = require('express');
const router = express.Router();
const EmployeeController = require("./../controllers/EmployeeController");
const auth = require("./../middlewares/Protect");
const hasRole = require("./../middlewares/HasRole");
router.route('/').get(EmployeeController.index).post(auth.auth, hasRole.HasRole('company', 'admin'), EmployeeController.store);
router.route('/:employeeId').get(EmployeeController.show).patch(EmployeeController.update).delete(EmployeeController.update);
module.exports = router;