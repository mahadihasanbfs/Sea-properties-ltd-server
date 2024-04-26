const { contact_collection } = require("../../Collections/admin_collection");
const { ObjectId } = require("mongodb");

const get_all_contacts = async (req, res, next) => {
  try {
    const result = await contact_collection.find({}).toArray();

    res.send({
      status: true,
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to fetch contacts",
    });
  }
};

const delete_contact_by_id = async (req, res, next) => {
  const id = req.query.contact_id;

  try {
    const result = await contact_collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount > 0) {
      res.send({
        status: true,
        message: "Contact deleted successfully",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Contact not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to delete contact",
    });
  }
};
const update_contact_by_id = async (req, res, next) => {
  const id = req.query.contact_id;
  const data = req.body.data;
  try {
    const result = await contact_collection.updateOne(
      { _id: id },
      {
        $set: data,
      },
      {
        upsert: true,
      }
    );

    if (result.deletedCount > 0) {
      res.send({
        status: true,
        message: "Contact Updated successfully",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Contact not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to delete contact",
    });
  }
};

const create_contact = async (req, res, next) => {
  const contactData = req.body;

  try {
    const result = await contact_collection.insertOne(contactData);
    res.send({
      status: true,
      message: "Contact created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Failed to create contact",
    });
  }
};

module.exports = {
  get_all_contacts,
  delete_contact_by_id,
  create_contact,
  update_contact_by_id,
};
