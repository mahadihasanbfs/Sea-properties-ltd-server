const { ObjectId } = require('mongodb');
const { land_collection } = require('../../Collections/admin_collection');


const add_land = async (req, res, next) => {
    const body = req.body;
    const name = body.name
    body.sku = name.toLowerCase().replace(' ', '_');

    try {
        const result = await land_collection.insertOne(body);
        res.send({
            status: true,
            message: "Your land uploaded successfully"
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to upload land"
        });
    }
};

const update_land = async (req, res, next) => {
    const id = req.query.land_id;
    const update = req.body;
    const name = update.name
    update.sku = name.toLowerCase().replace(' ', '_');

    try {
        const result = await land_collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
        if (result.modifiedCount > 0) {
            res.send({
                status: true,
                message: "land updated successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "land not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to update land"
        });
    }
};

const get_land_by_id = async (req, res, next) => {
    try {
        // Sanitize input: Ensure that the land name is properly formatted
        const id = req.query.land_id;

        if (!id) {
            // If land name is not provided, return a 400 Bad Request response
            return res.status(400).send({
                status: false,
                message: "land name is required"
            });
        }

        // Define aggregation pipeline to match land by name
        const pipeline = [
            { $match: { sku: id } }
        ];

        // Execute aggregation pipeline
        const result = await land_collection.aggregate(pipeline).toArray();

        if (result.length > 0) {
            // If land found, return it
            return res.send({
                status: true,
                data: result[0]
            });
        } else {
            // If land not found, return 404 response
            return res.status(404).send({
                status: false,
                message: "land not found"
            });
        }
    } catch (err) {
        // If an error occurs, return a 500 response with error message
        console.error("Failed to fetch land:", err);
        return res.status(500).send({
            status: false,
            message: "Failed to fetch land"
        });
    }
};


const delete_land = async (req, res, next) => {
    const id = req.query.land_id;

    try {
        const result = await land_collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.send({
                status: true,
                message: "land deleted successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "land not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to delete land"
        });
    }
};

const get_all_lands = async (req, res, next) => {
    try {
        const result = await land_collection.find({}).toArray();

        res.send({
            status: true,
            data: result
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch lands"
        });
    }
};

module.exports = { add_land, update_land, get_land_by_id, delete_land, get_all_lands };
