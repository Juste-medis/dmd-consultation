var express = require("express");
const app = express();
app.enable("trust proxy");
app.use(function (req, res, next) {
  if (req.secure) {
    next();
  } else {
    let redirl = "https://" + req.headers.host + req.url;
    res.redirect(redirl);
  }
});
module.exports = app;
