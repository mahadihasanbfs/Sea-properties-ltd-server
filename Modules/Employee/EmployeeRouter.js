const express = require("express");
const router = express.Router();
const {
  add_employee,
  get_all_employees,
  get_employee_by_id,
  update_employee,
  delete_employee,
} = require("./EmployeeController");

// Employee Routes
router.post("/add", add_employee);
router.post("/", add_employee);
router.get("/all", get_all_employees);
router.get("/", (req, res, next) => {
  if (req.query.employeeId || req.query.id) {
    return get_employee_by_id(req, res, next);
  }
  return get_all_employees(req, res, next);
});
router.get("/get-employee", get_employee_by_id);
router.put("/update", update_employee);
router.put("/", update_employee);
router.delete("/delete", delete_employee);
router.delete("/", delete_employee);

// Parameterized routes (placed after specific static endpoints)
router.get("/:id", get_employee_by_id);
router.put("/:id", update_employee);
router.delete("/:id", delete_employee);

module.exports = router;
