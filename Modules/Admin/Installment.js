const { ObjectId } = require('mongodb');
const { installment_collection } = require('../../Collections/admin_collection');

const add_installment = async (req, res, next) => {
    const body = req.body;
    try {
        const result = await installment_collection.insertOne(body);
        res.send({
            status: true,
            message: "Your installment uploaded successfully"
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to upload installment"
        });
    }
};

const update_installment = async (req, res, next) => {
    const id = req.query.installment_id;
    const update = req.body;

    try {
        const result = await installment_collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
        if (result.modifiedCount > 0) {
            res.send({
                status: true,
                message: "Installment updated successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Installment not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to update installment"
        });
    }
};

const get_installment_by_id = async (req, res, next) => {
    const id = req.query.installment_id;

    try {
        const pipeline = [
            { $match: { _id: new ObjectId(id) } }
        ];

        const result = await installment_collection.aggregate(pipeline).toArray();

        if (result.length > 0) {
            res.send({
                status: true,
                data: result[0]
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Installment not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch installment"
        });
    }
};

const delete_installment = async (req, res, next) => {
    const id = req.query.installment_id;

    try {
        const result = await installment_collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.send({
                status: true,
                message: "Installment deleted successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Installment not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to delete installment"
        });
    }
};

const get_all_installments = async (req, res, next) => {
    try {
        const result = await installment_collection.find({}).toArray();

        res.send({
            status: true,
            data: result
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch installments"
        });
    }
};

module.exports = { add_installment, update_installment, get_installment_by_id, delete_installment, get_all_installments };
