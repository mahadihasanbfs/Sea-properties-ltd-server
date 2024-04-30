const { ObjectId } = require("mongodb");
const {
  installment_collection,
} = require("../../Collections/admin_collection");

const add_installment = async (req, res, next) => {
  const body = req.body;
  try {
    const result = await installment_collection.insertOne(body);
    res.send({
      status: true,
      message: "Your installment uploaded successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to upload installment",
    });
  }
};

const update_installment = async (req, res, next) => {
  const id = req.query.installment_id;
  const update = req.body;

  try {
    const result = await installment_collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.modifiedCount > 0) {
      res.send({
        status: true,
        message: "Installment updated successfully",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Installment not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to update installment",
    });
  }
};

const get_installment_by_id = async (req, res, next) => {
  const id = req.query.installment_id;

  try {
    const pipeline = [{ $match: { _id: new ObjectId(id) } }];

    const result = await installment_collection.aggregate(pipeline).toArray();

    if (result.length > 0) {
      res.send({
        status: true,
        data: result[0],
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Installment not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to fetch installment",
    });
  }
};
const get_installment_by_email = async (req, res, next) => {
  const email = req.query.email; // Assuming 'email' in the query contains the email

  try {
    const pipeline = [
      { $match: { email } }, // Match based on the email
    ];

    const result = await installment_collection.aggregate(pipeline).toArray();

    if (result.length > 0) {
      res.send({
        status: true,
        data: result,
      });
    } else {
      res.status(404).send({
        status: false,
        message: "No installments found for the provided email",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to fetch installments",
    });
  }
};

const delete_installment = async (req, res, next) => {
  const id = req.query.installment_id;

  try {
    const result = await installment_collection.deleteOne({
      _id: new ObjectId(id),
    });

    console.log(id, "id", result);

    if (result.deletedCount > 0) {
      res.send({
        status: true,
        message: "Installment deleted successfully",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Installment not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to delete installment",
    });
  }
};

const get_all_installments = async (req, res, next) => {
  try {
    const result = await installment_collection
      .aggregate([
        { $addFields: { installmentNumber: { $toInt: "$installment" } } }, // Convert installment to a number
        { $sort: { _id: -1, email: 1, installmentNumber: 1 } }, // Sort by email and then by installment
      ])
      .toArray();

    res.send({
      status: true,
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to fetch installments",
    });
  }
};

module.exports = {
  add_installment,
  update_installment,
  get_installment_by_id,
  delete_installment,
  get_all_installments,
  get_installment_by_email,
};
