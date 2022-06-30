const yup = require("yup");
const Global = require("../Ressources/fr/Globals");

const SCHEMAS = {
  schemaSignUpUser: yup.object().shape({
    user_email: yup.string().email(Global.STRINGS.not_mail),
    user_pass: yup
      .string()
      .min(6, Global.STRINGS.small_pass)
      .required(Global.STRINGS.recquired_pass),
    identity: yup.string().required(Global.STRINGS.unfound_fields),
  }),
  schemaAddConsultation: yup.object().shape({
    cons_label: yup.string().required(Global.STRINGS.unfound_fields),
    cons_description: yup.string().required(Global.STRINGS.unfound_fields),
    cons_management: yup.string().required(Global.STRINGS.unfound_fields),
    cons_support: yup.string().required(Global.STRINGS.unfound_fields),
  }),
  schemaSignIn: yup.object().shape({
    username: yup
      .string()
      .min(3, "Vous devez saisir au moins trois lettres!")
      .required("champ recquis"),
    password: yup
      .string()
      .min(3)
      .required("Vous devez entrer un mot de passe."),
  }),

  schemaSignIn: yup.object().shape({
    user_email: yup
      .string()
      .min(3, Global.STRINGS.small_username)
      .max(50, Global.STRINGS.long_username),
    user_pass: yup.string().required(Global.STRINGS.recquired_pass),
  }),
};
function standarError(e) {
  throw Global.STRINGS.Ocurred_error + e;
}
module.exports = SCHEMAS;
