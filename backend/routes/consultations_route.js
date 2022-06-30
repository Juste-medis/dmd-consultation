const express = require("express");
const router = express.Router();
const stuffCtrl = require("../controllers/consultation");
const auth = require("../middleware/auth_data");
const corsSameSite = require("../middleware/corsSameSite");
const auth_admin = require("../middleware/auth_admin");

router.get("/getlines", corsSameSite, auth, auth_admin, stuffCtrl.getLines);

module.exports = router;
