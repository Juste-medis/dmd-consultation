var assert = require("assert");
exports.CompanySigned = async function (id) {
  let user = await global.dbo
    .collection("dmd_users")
    .findOne({ ID: id }, { projection: { user_type: 1 } });
  return user != null && user.user_type === "valide";
};
exports.FormatorOptions = async function (userid, courseid) {
  let autoption;
  if (userid) {
    autoption = await global.dbo
      .collection("dmd_users_minssi")
      .findOne({ ID: userid }, { projection: { _id: 0, userOptions: 1 } });
    autoption = await global.dbo
      .collection("dmd_users_minssi_option")
      .findOne({ label: autoption.userOptions }, { projection: { _id: 0 } });
  } else {
    let author = await global.dbo
      .collection("se_courses")
      .findOne({ ID: courseid }, { projection: { _id: 0, c_author: 1 } });
    autoption = await global.dbo
      .collection("dmd_users_minssi")
      .findOne(
        { ID: author.c_author },
        { projection: { _id: 0, userOptions: 1 } }
      );
    autoption = await global.dbo
      .collection("dmd_users_minssi_option")
      .findOne({ label: autoption.userOptions }, { projection: { _id: 0 } });
  }
  return autoption;
};
/**
 * verifie si l'utisateur a payé le cour en recherchant son id dans l'array Courses de userMeta
 * @param {*} userId id utilisateur
 * @param {*} courseId id du cour
 * @returns
 */

exports.hasPaid = async function (userId, courseId) {
  var userMeta = await global.dbo
    .collection("dmd_users_meta")
    .findOne({ ID: userId }, { projection: { _id: 0, courses: 1 } });
  //  assert(userMeta, "user not found");
  if (userMeta) {
    let paid = userMeta.courses.find((course) => {
      return Number(course.id) == courseId;
    });
    return paid;
  }
};
/**
 * obtenir le status d'un cour
 * @param {*} courseId id du cour
 * @returns
 */
exports.getOfferStatus = async function (courseId) {
  var courseMeta = await global.dbo
    .collection("dmd_offers")
    .findOne(
      { ID: courseId },
      { projection: { _id: 0, meta_status: 1, offer_status: 1 } }
    );
  if (courseMeta) {
    let { meta_status, offer_status } = courseMeta;
    return { meta_status, offer_status };
  }
};
/**
 * obtenir un paramèrez du système
 * @param {*} key tag de l'option
 * @returns
 */
exports.getSysParam = async function (key) {
  let { value } = await global.dbo
    .collection("se_params")
    .findOne({ name: key }, { projection: { value: 1 } });
  if (value) {
    return value;
  }
};
/**
 * verifie si l'utisateur est un formateur et a payé le cour en recherchant son id dans l'array
 * usersminssi sinon
 * @param {*} userId id formateur
 * @param {*} courseId id du cour
 * @returns
 */
exports.hasPostOffer = async function (userId, offerId) {
  let offer = await global.dbo
    .collection("dmd_offers")
    .findOne({ ID: offerId }, { projection: { _id: 0, companyID: 1 } });
  return offer.companyID === userId;
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
