const { contact_collection } = require("../../Collections/admin_collection");
const { ObjectId } = require('mongodb');

const get_all_contacts = async (req, res, next) => {
    try {
        const result = await contact_collection.find({}).toArray();

        res.send({
            status: true,
            data: result
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch contacts"
        });
    }
};

const delete_contact_by_id = async (req, res, next) => {
    const id = req.query.contact_id;

    try {
        const result = await contact_collection.deleteOne({ _id: ObjectId(id) });

        if (result.deletedCount > 0) {
            res.send({
                status: true,
                message: "Contact deleted successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Contact not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to delete contact"
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
            data: result.ops[0] // Return the created contact data
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to create contact"
        });
    }
};

module.exports = { get_all_contacts, delete_contact_by_id, create_contact };
