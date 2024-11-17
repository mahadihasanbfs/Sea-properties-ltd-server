const { ObjectId } = require('mongodb');
const { blog_collection } = require("../../Collections/admin_collection");

const add_blog = async (req, res, next) => {
      const body = req.body;
      body.sku = body?.name?.toLowerCase().replace(/\s+/g, '_');


      try {
            const result = await blog_collection.insertOne(body);
            res.send({
                  status: true,
                  message: "Your blog uploaded successfully"
            });
      } catch (err) {

            res.status(500).send({
                  status: false,
                  message: "Failed to upload blog"
            });
      }
};

const update_blog = async (req, res, next) => {
      const id = req.query.blog_id;
      const update = req.body;
      console.log(id);

      try {
            const result = await blog_collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...update } });
            if (result.modifiedCount > 0) {
                  res.send({
                        status: true,
                        message: "Blog updated successfully"
                  });
            } else {
                  res.status(404).send({
                        status: false,
                        message: "Blog not found"
                  });
            }
      } catch (err) {
            res.status(500).send({
                  status: false,
                  message: "Failed to update blog"
            });
      }
};

const get_blog_by_id = async (req, res, next) => {
      const id = decodeURIComponent(req.query.blog_id);
      console.log(id);
      try {
            const pipeline = [
                  { $match: { name: id } }
            ];

            const result = await blog_collection.aggregate(pipeline).toArray();

            if (result.length > 0) {
                  res.send({
                        status: true,
                        data: result[0]
                  });
            } else {
                  res.status(404).send({
                        status: false,
                        message: "Blog not found"
                  });
            }
      } catch (err) {
            res.status(500).send({
                  status: false,
                  message: "Failed to fetch blog"
            });
      }
};

const delete_blog = async (req, res, next) => {
      const id = req.query.blog_id;

      try {
            const result = await blog_collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount > 0) {
                  res.send({
                        status: true,
                        message: "Blog deleted successfully"
                  });
            } else {
                  res.status(404).send({
                        status: false,
                        message: "Blog not found"
                  });
            }
      } catch (err) {
            res.status(500).send({
                  status: false,
                  message: "Failed to delete blog"
            });
      }
};

const get_all_blogs = async (req, res, next) => {
      try {
            const result = await blog_collection.find({}).toArray();

            res.send({
                  status: true,
                  data: result
            });
      } catch (err) {
            res.status(500).send({
                  status: false,
                  message: "Failed to fetch blogs"
            });
      }
};


module.exports = { add_blog, update_blog, get_blog_by_id, delete_blog, get_all_blogs };
