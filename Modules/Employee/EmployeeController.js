const { ObjectId } = require("mongodb");
const { employee_collection } = require("../../Collections/admin_collection");

/**
 * Add a new employee
 */
const add_employee = async (req, res, next) => {
  try {
    const body = req.body;

    if (!body.name || !body.email) {
      return res.status(400).send({
        status: false,
        message: "Name and Email are required fields",
      });
    }

    const employeeData = {
      ...body,
      status: body.status || "active",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await employee_collection.insertOne(employeeData);

    res.status(201).send({
      status: true,
      message: "Employee added successfully",
      data: {
        _id: result.insertedId,
        ...employeeData,
      },
    });
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).send({
      status: false,
      message: "Failed to add employee",
      error: err.message,
    });
  }
};

/**
 * Get all employees with optional filtering & search
 */
const get_all_employees = async (req, res, next) => {
  try {
    const { department, status, search } = req.query;
    const query = {};

    if (department) {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await employee_collection.find(query).sort({ created_at: -1 }).toArray();

    res.send({
      status: true,
      totalCount: employees.length,
      data: employees,
    });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send({
      status: false,
      message: "Failed to fetch employees",
      error: err.message,
    });
  }
};

/**
 * Get a single employee by ID
 */
const get_employee_by_id = async (req, res, next) => {
  try {
    const id = req.query.employeeId || req.query.id || req.params.id;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({
        status: false,
        message: "Valid Employee ID is required",
      });
    }

    const employee = await employee_collection.findOne({ _id: new ObjectId(id) });

    if (!employee) {
      return res.status(404).send({
        status: false,
        message: "Employee not found",
      });
    }

    res.send({
      status: true,
      data: employee,
    });
  } catch (err) {
    console.error("Error fetching employee by ID:", err);
    res.status(500).send({
      status: false,
      message: "Failed to fetch employee",
      error: err.message,
    });
  }
};

/**
 * Update employee by ID
 */
const update_employee = async (req, res, next) => {
  try {
    const id = req.query.employeeId || req.query.id || req.params.id;
    const updateData = { ...req.body };
    delete updateData._id;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({
        status: false,
        message: "Valid Employee ID is required",
      });
    }

    updateData.updated_at = new Date();

    const result = await employee_collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Employee not found",
      });
    }

    res.send({
      status: true,
      message: "Employee updated successfully",
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).send({
      status: false,
      message: "Failed to update employee",
      error: err.message,
    });
  }
};

/**
 * Delete employee by ID
 */
const delete_employee = async (req, res, next) => {
  try {
    const id = req.query.employeeId || req.query.id || req.params.id;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({
        status: false,
        message: "Valid Employee ID is required",
      });
    }

    const result = await employee_collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Employee not found",
      });
    }

    res.send({
      status: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).send({
      status: false,
      message: "Failed to delete employee",
      error: err.message,
    });
  }
};

module.exports = {
  add_employee,
  get_all_employees,
  get_employee_by_id,
  update_employee,
  delete_employee,
};
