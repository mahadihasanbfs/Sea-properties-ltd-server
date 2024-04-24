const { user_collection } = require("../../Collections/UserCollection");
const hashPassword = require("../../helpers/authHelper");

const add_user = async (req, res, next) => {
  let data = req.body;

  data.role = "user";
  data.createTime = new Date().getTime();
  const hashedPassword = await hashPassword(data.password);

  data.password = hashedPassword;

  console.log(
    "🚀 ~ file: AuthenticationModule.js:6 ~ constadd_user= ~ data:",
    data
  );

  const exist = await user_collection.findOne({ email: data.email });
  console.log(exist,'======exist');
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
    console.log(result);
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

module.exports = { add_user, get_user, get_user_all };
