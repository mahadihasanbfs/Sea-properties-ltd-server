const express = require("express");
const router = express.Router();
const { sign_up_user } = require("./AuthenticationModule");

router.post("/sign-up", sign_up_user)

module.exports = router;