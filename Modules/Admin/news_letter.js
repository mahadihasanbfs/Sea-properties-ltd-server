const { ObjectId } = require("mongodb");
const { newsletter_collection } = require("../../Collections/admin_collection");


const get_all_newsletters = async (req, res, next) => {
    try {
        const result = await newsletter_collection.find({}).toArray();

        res.send({
            status: true,
            data: result
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch newsletters"
        });
    }
};

const delete_newsletter_by_id = async (req, res, next) => {
    const id = req.query.newsletter_id;

    try {
        const result = await newsletter_collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.send({
                status: true,
                message: "Newsletter deleted successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Newsletter not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to delete newsletter"
        });
    }
};

const create_newsletter = async (req, res, next) => {
    const newsletterData = req.body;

    try {
        const result = await newsletter_collection.insertOne(newsletterData);
        res.send({
            status: true,
            message: "Newsletter created successfully",
            data: result.ops[0] // Return the created newsletter data
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to create newsletter"
        });
    }
};


module.exports = { get_all_newsletters, delete_newsletter_by_id, create_newsletter };
