const express = require("express");
const router = express.Router();
//functions for creating routes and importing here.
const { add_user, get_user, get_user_all, update_user, delete_user } = require("./AuthenticationModule");

router.get("/sign-in", get_user);
router.post("/sign-up", add_user);
router.put("/update", update_user);
router.get("/", get_user_all);
router.delete("/delete", delete_user);


module.exports = router;
