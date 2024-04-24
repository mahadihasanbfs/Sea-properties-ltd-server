const express = require("express");
const router = express.Router();
//functions for creating routes and importing here.
const { add_user, get_user, get_user_all } = require("./AuthenticationModule");

router.get("/sign-in", get_user);
router.post("/sign-up", add_user);

router.get("/", get_user_all);

module.exports = router;
