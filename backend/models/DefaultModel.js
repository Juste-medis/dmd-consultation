const { date_to_string } = require("../helpers/utils");

module.exports = {
  User: {
    user_email: "",
    user_pass: "",
    identity: "",
    visibility: "active",
    user_type: "",
    user_status: 1,
    user_registered: new Date(Date.now()).toISOString(),
    last_connected: new Date(Date.now()).toISOString(),
  },
  Consultation: {
    code: 1,
    cons_label: "",
    cons_description: "",
    cons_management: "",
    cons_support: "",
    cons_date: date_to_string(new Date(Date.now()).toISOString()),
  },
  Consultation_raw: {
    Code: 1,
    Label: "",
    Support: "",
    Management: "",
    Date: "",
    Date: "",
    Description: "",
  },
};
