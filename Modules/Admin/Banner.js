const { ObjectId } = require('mongodb');
const { banner_collection } = require('../../Collections/admin_collection');
 
const add_banner = async (req, res, next) => {
    const body = req.body;
    try {
        const result = await banner_collection.insertOne(body);
        res.send({
            status: true,
            message: "Your banner uploaded successfully"
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to upload banner"
        });
    }
};

const update_banner = async (req, res, next) => {
    const id = req.query.banner_id;
    const update = req.body;

    try {
        const result = await banner_collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
        if (result.modifiedCount > 0) {
            res.send({
                status: true,
                message: "banner updated successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "banner not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to update banner"
        });
    }
};

const get_banner_by_id = async (req, res, next) => {
    const id = req.query.banner_id;

    try {
        const pipeline = [
            { $match: { _id: new ObjectId(id) } }
        ];

        const result = await banner_collection.aggregate(pipeline).toArray();

        if (result.length > 0) {
            res.send({
                status: true,
                data: result[0]
            });
        } else {
            res.status(404).send({
                status: false,
                message: "banner not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch banner"
        });
    }
};

const delete_banner = async (req, res, next) => {
    const id = req.query.banner_id;

    try {
        const result = await banner_collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.send({
                status: true,
                message: "banner deleted successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "banner not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to delete banner"
        });
    }
};

const get_all_banners = async (req, res, next) => {
    try {
        const result = await banner_collection.find({}).toArray();

        res.send({
            status: true,
            data: result
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch banners"
        });
    }
};


module.exports = { add_banner, update_banner, get_banner_by_id, delete_banner, get_all_banners };
