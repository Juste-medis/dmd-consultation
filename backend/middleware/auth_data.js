const config = require("../config/config.json");
const jwt = require("jsonwebtoken");
const sessionHandler = require("../helpers/sessionHandler");

module.exports = async (req, res, next) => {
  try {
    const userId = jwt.verify(
      sessionHandler.getAppCookies(req, res, "__ars_x_crypt"),
      config.secret
    ).userId;

    const user_type = jwt.verify(
      sessionHandler.getAppCookies(req, res, "__ars_x_crypty"),
      config.secret
    ).user_type;

    if (userId) {
      req.params.userId = Number(userId);
      req.params.userType = user_type;
      //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
      const isActivve = await require("../helpers/dbUtils").getUserStatus(
        req.params.userId
      );
      if (!["active", "review", "blocked"].includes(isActivve)) {
        return res.status(200).json({ message: "status invalid", code: 1 });
      }
      if (isActivve === "blocked") {
        return res.status(200).json({ message: "Utilisateur Bloqué", code: 1 });
      } else {
        global.dbo
          .collection("dmd_users")
          .updateOne(
            { ID: req.params.userId },
            { $set: { last_connected: new Date(Date.now()).toISOString() } },
            function (err, res) {
              if (err) throw err;
            }
          );
        next();
      }
    }
  } catch (error) {
    throw error;
  }
};
