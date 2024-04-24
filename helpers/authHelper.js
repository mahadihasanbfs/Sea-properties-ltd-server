const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 5;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = hashPassword;
