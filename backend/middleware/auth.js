const config = require("../config/config.json");
const jwt = require("jsonwebtoken");
const sessionHandler = require("../helpers/sessionHandler");
const Global = require("../Ressources/fr/Globals");

module.exports = async (req, res, next) => {
  var nb = Number(req.params.nb);
  if (!isNaN(nb)) {
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

        const isActivve = await require("../helpers/dbUtils").getUserStatus(
          req.params.userId
        );
        if (!["active", "review", "blocked"].includes(isActivve)) {
          return res.status(200).json({ message: "status invalid", code: 1 });
        }
        if (isActivve === "blocked") {
          return res
            .status(200)
            .json({ message: "Utilisateur Bloqué", code: 1 });
        } else next();
      }
    } catch (error) {
      res.status(200).json({
        error: "Invalid request!",
      });
    }
  } else {
    res.status(401).json({
      error: "invalid parameter",
    });
  }
};
