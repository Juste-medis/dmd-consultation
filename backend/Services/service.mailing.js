const Scheme = require("../models/schemas");
const { ContactMessage } = require("../models/DefaultModel");
const Joi = require("joi");
const Helper = require("../helpers/utils");
const { sanitizeObject } = require("../helpers/utils");

async function SendMail(req) {
  let { to, message, subject } = req;
  const nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: require("../config/data_identifier").mailconnect,
  });
  let info = await transporter.sendMail({
    from: "medisadido@gmail.com",
    to,
    subject,
    html: message,
  });
  transporter.sendMail(info, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + to + "---" + message);
    }
  });
}

module.exports = {
  SendMail,
};
