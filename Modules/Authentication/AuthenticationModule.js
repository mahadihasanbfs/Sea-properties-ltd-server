const { ObjectId } = require("mongodb");
const { user_collection } = require("../../Collections/UserCollection");
const hashPassword = require("../../helpers/authHelper");

const add_user = async (req, res, next) => {
      let data = req.body;

      data.role = "user";
      data.createTime = new Date().getTime();
      //   const hashedPassword = await hashPassword(data.password);
      //   if (data?.password) {
      //     data.password = hashedPassword;
      //   }

      const exist = await user_collection.findOne({ email: data.email });

      if (exist) {
            res.send({
                  status: false,
                  message: "User Already Exist",
            });
      } else {
            const result = await user_collection.insertOne(data);
            res.send({
                  status: true,
                  message: "User Added Successfully",
                  data: result,
            });

      }
};

const get_user = async (req, res, next) => {
      try {
            const gmail = req.query.email;
            const user = await user_collection.findOne({ email: gmail });
            if (!user) {
                  res.send({
                        status: false,
                        message: "User Not Found",
                  });
            }
            res.send({
                  status: true,
                  message: "User Found Successfully",
                  data: user,
            });
      } catch (error) {
            next(error);
      }
};

const get_user_all = async (req, res, next) => {
      try {
            const users = await user_collection.find().toArray();
            res.send({
                  status: true,
                  message: "Users Found Successfully",
                  data: users,
            });
      } catch (error) {
            next(error);
      }
};

const delete_user = async (req, res, next) => {
      try {
            const id = req.query.id;
            const result = await user_collection.deleteOne({ _id: new ObjectId(id) });
            res.send({
                  status: true,
                  message: "User Deleted Successfully",
                  data: id,
            });
      } catch (error) {
            next(error);
      }
};

const update_user = async (req, res, next) => {
      try {
            const id = req.query.id;
            const data = req.body;
            const result = await user_collection.updateOne(
                  { _id: new ObjectId(id) },
                  {
                        $set: {
                              name: data.name,
                              email: data.email
                        }
                  }
            );
            res.send({
                  status: true,
                  message: "User Updated Successfully",
                  data: result,
            });
      } catch (error) {
            next(error);
      }
};

module.exports = { add_user, get_user, get_user_all, update_user, delete_user };
