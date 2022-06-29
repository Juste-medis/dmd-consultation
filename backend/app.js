const express = require("express");
const app = express();
const path = require("path");
const BodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
var compression = require("compression");
const errorHandler = require("./helpers/error-handler");
const connectmongo = require("./helpers/db");

//app.use(helmet());
app.use(compression());
app.use(connectmongo);
app.use(cookieParser());
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.options("*", cors());

app.use(express.static(path.join(__dirname, "build")));

//app.use("/djondoapi/royal/test", require("./routes/test/route_test"));
app.use("/djondoapi/royal/dashboard", require("./routes/dashboard_route"));
app.use(
  "/djondoapi/royal/consulations",
  require("./routes/consultations_route")
);
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
app.use("/auth/users", require("./routes/user_route"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use((req, res, next) => {
  res.status(404).send("<h1>Not-Found :-)</h1>");
});
app.use(errorHandler);

module.exports = app;

/*
app.use((req, res, next) => {
  cookies.set("testtoken", { expires:²² Date.now() });
});
*/
