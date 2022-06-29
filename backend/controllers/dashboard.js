const dashboardservice = require("../Services/service.dashboard");
const reponse_me = require("../middleware/responser");

exports.UpdateOption = (req, res, next) => {
  dashboardservice
    .UpdateOption(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^formateur^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
exports.getConsultations = (req, res, next) => {
  dashboardservice
    .getConsultations(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};
exports.getSuperAdminOption = (req, res, next) => {
  dashboardservice
    .getSuperAdminOption(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};
exports.AGetStatistics = (req, res, next) => {
  dashboardservice
    .AGetStatistics(req)
    .then((data) => {
      reponse_me(res, data);
    })
    .catch((err) => next(err));
};
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
