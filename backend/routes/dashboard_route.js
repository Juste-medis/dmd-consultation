const express = require("express");
const router = express.Router();
const stuffCtrl = require("../controllers/dashboard");
const auth = require("../middleware/auth_data");
const corsSameSite = require("../middleware/corsSameSite");
const auth_admin = require("../middleware/auth_admin");
const auth_superadmin = require("../middleware/auth_super_admin");

router.post("/update/option", corsSameSite, auth, stuffCtrl.UpdateOption);
router.post(
  "/caspero/load/:option",
  corsSameSite,
  auth,
  auth_admin,
  stuffCtrl.populateConsultation
);

router.get(
  "/data/consultations",
  corsSameSite,
  auth,
  stuffCtrl.getConsultations
);
router.get(
  "/caspero/options/:option",
  corsSameSite,
  auth,
  auth_admin,
  stuffCtrl.getSuperAdminOption
);

router.get(
  "/caspero/statistics/:option",
  corsSameSite,
  auth,
  auth_admin,
  stuffCtrl.AGetStatistics
);

module.exports = router;
