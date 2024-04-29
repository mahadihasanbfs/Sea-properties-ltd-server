const express = require("express");
const {
  create_contact,
  update_contact_by_id,
} = require("../Modules/Admin/Contact");
const router = express.Router();

//! contact
router.post("/contact/add", create_contact);
router.post("/contact/update", update_contact_by_id);

module.exports = router;
