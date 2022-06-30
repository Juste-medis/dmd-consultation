var assert = require("assert");

/**
 * obtenir un paramèrez du système
 * @param {*} key tag de l'option
 * @returns
 */
exports.getSysParam = async function (key) {
  let { value } = await global.dbo
    .collection("dmd_params")
    .findOne({ name: key }, { projection: { value: 1 } });
  if (value) {
    return value;
  }
};
/**
 * verifie si l'utisateur est un administrateur
 * usersminssi sinon
 * @param {*} userId id formateur
 * @returns
 */
exports.isAdmin = async function (userId) {
  let userMeta = await global.dbo
    .collection("dmd_users")
    .findOne({ ID: userId }, { projection: { _id: 0, user_status: 1 } });
  assert(userMeta, "unenregistred");
  if (userMeta) {
    return userMeta.user_status === 4 || userMeta.user_status === 5;
  }
};
/**
 * verifie si l'utisateur est un super administrateur
 * usersminssi sinon
 * @param {*} userId id formateur
 * @returns
 */
exports.isSuperAdmin = async function (userId) {
  let userMeta = await global.dbo
    .collection("dmd_users")
    .findOne({ ID: userId }, { projection: { _id: 0, user_status: 1 } });
  assert(userMeta, "unenregistred");
  if (userMeta) {
    return userMeta.user_status === 5;
  }
};
/**
 * verifie si l'utisateur n'est pas bloqué
 * usersminssi sinon
 * @param {*} userId id formateur
 * @returns
 */
exports.getUserStatus = async function (userId) {
  let userMeta = await global.dbo
    .collection("dmd_users")
    .findOne({ ID: userId }, { projection: { _id: 0, visibility: 1 } });
  assert(userMeta, "unenregistred");
  if (userMeta) {
    return userMeta.visibility;
  }
};
/**
 * verifie si le token existe deja dans la base ded donnée
 * @param {*} token id formateur
 * @returns
 */
exports.uniqtoken = async function (token) {
  let userMeta = await global.dbo
    .collection("se_commands")
    .findOne({ token }, { projection: { _id: 0, order_id: 1 } });
  assert(!userMeta, "trnsaction id already used");
  if (!userMeta) {
    return 1;
  }
};

/**
 * corbeille
 * usersminssi sinon
 * @param {*} userId id formateur
 * @param {*} courseId id du cour
 * @returns
 */
exports.trashCollection = async function (data, thing, type = "table") {
  if (data) {
    let fidata = {
      thing,
      type,
      trash_date: new Date(Date.now()).toISOString(),
      ...data,
    };
    await dbo.collection("dodotrash").insertOne(fidata, function (err, res) {
      if (err) throw err;
    });
    return 1;
  }
};
