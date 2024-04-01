const { ObjectId } = require('mongodb');
const { booking_collection } = require("../../Collections/admin_collection");

const add_booking = async (req, res, next) => {
    const body = req.body;
    try {
        const result = await booking_collection.insertOne(body);
        res.send({
            status: true,
            message: "Booking created successfully"
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to create booking"
        });
    }
};

const update_booking = async (req, res, next) => {
    const id = req.query.booking_id;
    const update = req.body;

    try {
        const result = await booking_collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
        if (result.modifiedCount > 0) {
            res.send({
                status: true,
                message: "Booking updated successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Booking not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to update booking"
        });
    }
};

const get_booking_by_id = async (req, res, next) => {
    const id = req.query.booking_id;

    try {
        const pipeline = [
            { $match: { _id: new ObjectId(id) } }
        ];

        const result = await booking_collection.aggregate(pipeline).toArray();

        if (result.length > 0) {
            res.send({
                status: true,
                data: result[0]
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Booking not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch booking"
        });
    }
};

const delete_booking = async (req, res, next) => {
    const id = req.query.booking_id;

    try {
        const result = await booking_collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.send({
                status: true,
                message: "Booking deleted successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Booking not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to delete booking"
        });
    }
};

const get_all_bookings = async (req, res, next) => {
    try {
        const result = await booking_collection.find({}).toArray();

        res.send({
            status: true,
            data: result
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch bookings"
        });
    }
};

module.exports = { add_booking, update_booking, get_booking_by_id, delete_booking, get_all_bookings };
