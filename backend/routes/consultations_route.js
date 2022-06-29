const express = require("express");
const router = express.Router();
const stuffCtrl = require("../controllers/consultation");
const auth = require("../middleware/auth_data");
const corsSameSite = require("../middleware/corsSameSite");
const auth_admin = require("../middleware/auth_admin");

router.post(
  "/oupdate/masca/:id",
  corsSameSite,
  auth,
  stuffCtrl.updateOfferParams
);
router.post("/add/masqu", corsSameSite, auth, stuffCtrl.addConsultation);

router.get("/", corsSameSite, auth, auth_admin, stuffCtrl.getAllStuffAdmin);
router.get("/getall", corsSameSite, stuffCtrl.getAllStuff);
router.get("/getunity/:id", corsSameSite, stuffCtrl.getStuff);
router.get("/:name/:all", stuffCtrl.getStuff);

module.exports = router;
