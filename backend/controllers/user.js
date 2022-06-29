const userService = require("../Services/users.service");
const Global = require("../Ressources/fr/Globals");
const sessionHandler = require("../helpers/sessionHandler");

exports.register = (req, res, next) => {
  userService
    .createUser(req.body)
    .then((reset) => {
      if (reset) {
        res.json({ ok: Global.STRINGS.succesfully_signup });
      } else {
        res.status(400).json({ message: Global.STRINGS.Ocurred_error });
      }
    })
    .catch((err) => next(err));
};
exports.authenticate = (req, res, next) => {
  userService
    .authenticate(req.body, res)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: Global.STRINGS.incorect_user_or_pass });
      }
    })
    .catch((err) => next(err));
};

exports.signOut = async (req, res, next) => {
  sessionHandler.RemoveCookie(res, "__ars_x_crypt");
  let { userId } = req.params;
  userId = Number(userId);
  const user = await global.dbo
    .collection("dmd_users")
    .findOne({ ID: userId }, { projection: { _id: 0, public_name: 1 } });
  res.json(user);
};
exports.aupdate = (req, res, next) => {
  userService
    .aupdate(req)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: Global.STRINGS.Ocurred_error });
      }
    })
    .catch((err) => next(err));
};
exports._delete = (req, res, next) => {
  userService
    .delete(req.params.id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: Global.STRINGS.Ocurred_error });
      }
    })
    .catch((err) => next(err));
};
exports.getAll = (req, res, next) => {
  userService
    .getAll(req)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: Global.STRINGS.Ocurred_error });
      }
    })
    .catch((err) => next(err));
};

exports.ActonUser = (req, res, next) => {
  userService
    .ActonUser(req)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: Global.STRINGS.Ocurred_error });
      }
    })
    .catch((err) => next(err));
};

exports.getCurrent = (req, res, next) => {
  userService
    .getById(req.params)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({});
      }
    })
    .catch((err) => next(err));
};

exports.getById = (req, res, next) => {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
};

exports.getUserUnity = (req, res, next) => {
  userService
    .getUserUnity(req)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
};
