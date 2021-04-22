const express = require('express');
const router = express.Router();
const EmployeeController = require("./../controllers/EmployeeController")
router.route('/').get(EmployeeController.index).post(EmployeeController.store);
router.route('/:employeeId').get(EmployeeController.show).patch(EmployeeController.update).delete(EmployeeController.update);
module.exports = router;