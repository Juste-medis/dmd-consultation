const express = require("express");
const router = express.Router();
const stuffCtrl = require("./test");
const stuffCtrlo = require("./testo");

router.get("/", stuffCtrl.getAllStuff);
router.get("/:star", stuffCtrl.handleStar);
router.get("/new/:star", stuffCtrlo.handleStar);

module.exports = router;
