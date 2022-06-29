const courseservice = require("../Services/service.consultation");
const reponse_me = require("../middleware/responser");
exports.getAllStuffAdmin = (req, res, next) => {
  courseservice
    .getAllStuffAdmin(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};
exports.getAllStuff = (req, res, next) => {
  courseservice
    .getAllStuff(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};

exports.getStuff = (req, res, next) => {
  courseservice
    .getStuff(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};

exports.updateOfferParams = (req, res, next) => {
  courseservice
    .updateOfferParams(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};

exports.addConsultation = (req, res, next) => {
  courseservice
    .addConsultation(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};

exports.applyToOffer = (req, res, next) => {
  courseservice
    .applyToOffer(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};
