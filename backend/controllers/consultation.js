const consultationservice = require("../Services/service.consultation");
const reponse_me = require("../middleware/responser");


exports.getLines = (req, res, next) => {
  consultationservice
    .getLines(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};


exports.addConsultation = (req, res, next) => {
  consultationservice
    .addConsultation(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};

