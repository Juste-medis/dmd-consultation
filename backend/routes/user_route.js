const express = require("express");
const router = express.Router();
const stuffCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const auth_data = require("../middleware/auth_data");
const corsSameSite = require("../middleware/corsSameSite");
const auth_admin = require("../middleware/auth_admin");

var csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });

router.post("/register", stuffCtrl.register);

router.post("/authenticate", corsSameSite, stuffCtrl.authenticate);
router.post("/current/:nb", corsSameSite, auth, stuffCtrl.getCurrent);

router.post("/signout", corsSameSite, auth_data, stuffCtrl.signOut);

router.post("/aupdate", corsSameSite, auth_data, auth_admin, stuffCtrl.aupdate);

router.post(
  "/acton/users",
  corsSameSite,
  auth_data,
  auth_admin,
  stuffCtrl.ActonUser
);

router.post(
  "/unity/getuser/:id",
  corsSameSite,
  auth_data,
  auth_admin,
  stuffCtrl.getUserUnity
);

router.get(
  "/auser/list",
  corsSameSite,
  auth_data,
  auth_admin,
  stuffCtrl.getAll
);
router.get("/user/list", corsSameSite, stuffCtrl.getAll);

router.get("/public/unity/getuser/:id", corsSameSite, stuffCtrl.getUserUnity);
router.get("/get/formvalidation", csrfProtection, function (req, res) {
  res.cookie("XSRF-TOKEN", req.csrfToken());
});

module.exports = router;
