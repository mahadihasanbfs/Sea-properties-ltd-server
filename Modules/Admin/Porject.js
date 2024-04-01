const { ObjectId } = require('mongodb');
const { project_collection } = require('../../Collections/admin_collection');

const add_project = async (req, res, next) => {
    const body = req.body;
    try {
        const result = await project_collection.insertOne(body);
        res.send({
            status: true,
            message: "Your project uploaded successfully"
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to upload project"
        });
    }
};

const update_project = async (req, res, next) => {
    const id = req.query.project_id;
    const update = req.body;

    try {
        const result = await project_collection.updateOne({ _id: ObjectId(id) }, { $set: update });
        if (result.modifiedCount > 0) {
            res.send({
                status: true,
                message: "Project updated successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Project not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to update project"
        });
    }
};

const get_project_by_id = async (req, res, next) => {
    const id = req.query.project_id;

    try {
        const pipeline = [
            { $match: { _id: ObjectId(id) } }
        ];

        const result = await project_collection.aggregate(pipeline).toArray();

        if (result.length > 0) {
            res.send({
                status: true,
                data: result[0]
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Project not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch project"
        });
    }
};

const delete_project = async (req, res, next) => {
    const id = req.query.project_id;

    try {
        const result = await project_collection.deleteOne({ _id: ObjectId(id) });

        if (result.deletedCount > 0) {
            res.send({
                status: true,
                message: "Project deleted successfully"
            });
        } else {
            res.status(404).send({
                status: false,
                message: "Project not found"
            });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to delete project"
        });
    }
};

const get_all_projects = async (req, res, next) => {
    try {
        const result = await project_collection.find({}).toArray();

        res.send({
            status: true,
            data: result
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to fetch projects"
        });
    }
};

module.exports = { add_project, update_project, get_project_by_id, delete_project, get_all_projects };
