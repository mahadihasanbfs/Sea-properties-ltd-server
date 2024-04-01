
const express = require("express");
const router = express.Router();
//functions for creating routes and importing here.
const { add_user, get_user } = require("./AuthenticationModule")


router.get('/sign-in', get_user)
router.post('/sign-up', add_user)


module.exports = router;