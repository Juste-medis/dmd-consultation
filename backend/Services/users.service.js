const config = require("../config/config.json");
const jwt = require("jsonwebtoken");
const Scheme = require("../models/schemas");
const {
  User,
  Company,
  simple,
  UserMeta,
  MesNoti,
  simple_usi,
  Company_usi,
  User_usi,
} = require("../models/DefaultModel");
const incrementor = require("../helpers/id_incrementor");
const Helper = require("../helpers/utils");
const HelperFile = require("../helpers/fileUtils");
const Global = require("../Ressources/fr/Globals");
var assert = require("assert");
const sessionHandler = require("../helpers/sessionHandler");

//-------------------------------------------------
const bcrypt = require("bcrypt");
const { Numberrise, Booleanise } = require("../helpers/utils");
const { isSuperAdmin, isAdmin } = require("../helpers/dbUtils");
//-------------------------------------------------

async function createUser(userParam) {
  //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  await Scheme.schemaSignUpUser.validate(userParam);
  userParam = Helper.objectSerealizer(userParam);
  userParam = Helper.SimilObject(User, userParam);
  //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  let mail = userParam.user_email,
    pass = userParam.user_pass;
  if (await global.dbo.collection("dmd_users").findOne({ user_email: mail })) {
    throw Global.STRINGS.already_taken_username;
  }
  let newID = await incrementor("dmd_users");
  newID++;

  let userdata = Helper.SimilObject(User, userParam);

  let newUser = {
    ...User,
    ...userdata,
    ID: newID,
    user_pass: bcrypt.hashSync(pass, 10),
    user_type: "simple",
  };
  await global.dbo
    .collection("dmd_users")
    .insertOne(newUser, function (err, res) {
      if (err) throw err;
    });

  // require("./service.mailing").SendMail({
  //   to: user_email,
  //   message: `Un nouvel Utilisateur Enregisté . Identité: ${userdata.identity}  E-mail: ${userdata.user_email}`,
  //   subject: "Inscription",
  // });

  return newUser;
}
async function authenticate(route, res) {
  await Scheme.schemaSignIn.validate(route);
  route = Helper.objectSerealizer(route);
  var { user_email, user_pass } = route;
  const user = await global.dbo
    .collection("dmd_users")
    .findOne({ $or: [{ user_email }] });

  if (!user) throw Global.STRINGS.unexisted_user;
  if (user) {
    const valid = bcrypt.compareSync(user_pass, user.user_pass);
    if (valid) {
      const isActivve = await require("../helpers/dbUtils").getUserStatus(
        user.ID
      );
      if (isActivve === "blocked") {
        throw "Utilisateur Bloqué";
      }

      let newvalues = {
        last_connected: new Date(Date.now()).toISOString(),
      };
      await global.dbo
        .collection("dmd_users")
        .updateOne(
          { ID: Number(user.ID) },
          { $set: newvalues },
          function (err, res) {
            if (err) throw err;
          }
        );
      const token = jwt.sign({ userId: user.ID }, config.secret, {
        expiresIn: "60d",
      });
      sessionHandler.SetCookie(
        res,
        "__ars_x_crypt",
        token,
        Global.COOKIE_DURATIONN.TOKEN_AUTHENTICATE
      );
      sessionHandler.SetCookie(
        res,
        "__ars_x_crypty",
        jwt.sign({ user_type: user.user_type }, config.secret, {
          expiresIn: "60d",
        }),
        Global.COOKIE_DURATIONN.TOKEN_AUTHENTICATE
      );
      //-------------------------------uglificaction-------------------------------
      sessionHandler.SetCookie(
        res,
        "__ars_x_host_root",
        jwt.sign({ userId: Math.random() * 2000 }, config.secret, {
          expiresIn: "7d",
        }),
        Global.COOKIE_DURATIONN.TOKEN_AUTHENTICATE
      );
      sessionHandler.SetCookie(
        res,
        "__ars_x_royalrui",
        jwt.sign({ userId: Math.random() * 2000 }, config.secret, {
          expiresIn: "7d",
        }),
        Global.COOKIE_DURATIONN.TOKEN_AUTHENTICATE
      );
      sessionHandler.SetCookie(
        res,
        "__ars_x_rsedamii",
        jwt.sign({ userId: Math.random() * 2000 }, config.secret, {
          expiresIn: "7d",
        }),
        Global.COOKIE_DURATIONN.TOKEN_AUTHENTICATE
      );
      sessionHandler.SetCookie(
        res,
        "__ars_z__fefrui",
        jwt.sign({ userId: Math.random() * 2000 }, config.secret, {
          expiresIn: "7d",
        }),
        Global.COOKIE_DURATIONN.TOKEN_AUTHENTICATE
      );
      //--------------------------------------------------------------------------
      var final_user = {
        token,
        ...user,
      };
      if (await isAdmin(user.ID)) {
        final_user.isadmin = "admin";
      }

      return final_user;
    }
  }
}

async function getById(params) {
  let { userId, userType } = params,
    data_type = Number(params.nb);
  let mappingi = [
    "meta.firstname",
    "meta.lastname",
    "meta.curiculum",
    "meta.companyname",
    "meta.ent_civility",
  ];
  let vartable, compob;
  if (userType === "simple") {
    vartable = "dmd_simples";
    compob = {
      "meta.firstname": 1,
      "meta.lastname": 1,
    };
  } else {
    vartable = "dmd_companies";
    compob = {
      "meta.companyname": 1,
      "meta.ent_civility": 1,
    };
  }
  let dataProject = {};
  if (data_type === 20) {
    dataProject = {
      _id: 0,
      ID: 1,
      user_email: 1,
      saved: 1,
      public_name: 1,
      avatar: 1,
      last_connected: 1,
      ...compob,
    };
  } else if (data_type === 100) {
    dataProject["_id"] = 0;
    dataProject["meta._id"] = 0;
    dataProject["user_pass"] = 0;
    dataProject["saved"] = 0;
    dataProject["user_type"] = 0;
    dataProject["visibility"] = 0;
  } else {
    dataProject[mappingi[data_type]] = 1;
    dataProject["_id"] = 0;
  }
  var usarr = await global.dbo
    .collection("dmd_users")
    .aggregate([
      {
        $lookup: {
          from: vartable,
          localField: "ID",
          foreignField: "ID",
          as: "meta",
        },
      },
      {
        $match: { ID: Number(userId) },
      },
      {
        $project: dataProject,
      },
    ])
    .toArray();
  Object.assign(usarr[0], usarr[0].meta[0]);
  delete usarr[0].meta;
  return usarr[0];
}

async function getUserUnity(req) {
  let { id } = req.params,
    dataProject = {
      _id: 0,
    },
    vartab;
  id = Number(id);
  let user = await global.dbo
    .collection("dmd_users")
    .findOne({ ID: id }, dataProject);
  let { user_type } = user;
  if (user_type === "simple") {
    vartab = "dmd_simples";
    Object.assign(dataProject, {});
  } else {
    vartab = "dmd_companies";
    Object.assign(dataProject, {});
  }
  let userm = await global.dbo
    .collection(vartab)
    .findOne({ ID: id }, dataProject);

  Object.assign(user, userm);
  return user;
}

async function aupdate(req) {
  let userParam = req.body;
  let id = Number(userParam.ID);
  let { action } = req.query;
  //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  let { ids } = userParam;
  userParam = Helper.SimilObject(User, userParam);
  //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  if (userParam.visibility) {
    assert(
      ["active", "review", "blocked"].includes(userParam.visibility),
      "bad status"
    );
  }
  if (userParam.user_status) {
    userParam = Numberrise(userParam);
    assert([1, 4, 5].includes(userParam.user_status), "bad level");

    if (userParam.user_status === 1) {
      let userm = await global.dbo
        .collection("dmd_users")
        .find({ user_status: 4 })
        .toArray();
      assert(
        userm.length >= 2,
        "Operation non possible pour le moment ! Assurez-vous la disponibilité d'un administrateur "
      );
    }
  }
  if (action === "bulk") {
    ids = ids.split(",").map((e) => Number(e));
    global.dbo
      .collection("dmd_users")
      .updateMany(
        { ID: { $in: ids } },
        { $set: userParam },
        function (err, res) {
          if (err) throw err;
        }
      );
  } else {
    let user_pass;
    if (userParam.new_pass && userParam.new_pass.length > 0) {
      user_pass = userParam.new_pass;
    }
    const user = await global.dbo.collection("dmd_users").findOne({ ID: id });
    if (!user) throw Global.STRINGS.unexisted_user;
    if (
      userParam.user_email &&
      user.user_email !== userParam.user_email &&
      (await global.dbo
        .collection("dmd_users")
        .findOne({ user_email: userParam.user_email }))
    ) {
      throw Global.STRINGS.already_taken_username;
    }
    if (user_pass) {
      userParam.user_pass = bcrypt.hashSync(userParam.user_pass, 10);
    }

    global.dbo
      .collection("dmd_users")
      .updateOne({ ID: Number(id) }, { $set: userParam }, function (err, res) {
        if (err) throw err;
      });
  }

  return 1;
}

async function _delete(id) {
  await global.dbo.collection("dmd_users").findOneAndDelete({ ID: id });
}

module.exports = {
  authenticate,
  getById,
  createUser,
  delete: _delete,
  getUserUnity,
  aupdate,
};
