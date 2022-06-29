const yup = require("yup");
const Joi = require("joi");
const Global = require("../Ressources/fr/Globals");
const meta_status_valus = [
  "programmé",
  "active",
  "inactive",
  "review",
  "allowed",
  "rejected",
  "blocked",
  "",
];
const userdefault = {
  user_email: yup.string().email(Global.STRINGS.not_mail),
  user_pass: yup
    .string()
    .min(6, Global.STRINGS.small_pass)
    .required(Global.STRINGS.recquired_pass),
  agreedToTerms: yup.bool(),
  avatar: yup.string(),
  country: yup
    .string()
    .oneOf(Global.COUNTRIES, "Indiquez votre pays")
    .required(Global.STRINGS.recquired_country),
  city: yup.string().required(Global.STRINGS.recquired_city),
  website: yup.string().url(Global.STRINGS.not_url).nullable(),
  address: yup.string(),
};
const addoferdefault = {
  candidate_totals: yup.number().min(1),
  categories: yup
    .array()
    .min(1, Global.STRINGS.min_offeracti)
    .max(2, Global.STRINGS.long_offeracti)
    .required(Global.STRINGS.recquired_companyacti),
  offer_city: yup.string().required(Global.STRINGS.recquired_city),
  offer_contrattype: yup
    .array()
    .min(1, "Cochez les formes de contrat")
    .of(yup.string().oneOf(Global.CONTRAT_TYPE, "Type de contrat non valide"))
    .nullable()
    .required("Cochez les formes de contrat"),
  offer_explevel: yup
    .string()
    .oneOf(Global.EXPERIENCE_LEVEL, "Niveau d'expérience non valide")
    .required(Global.STRINGS.recquired_ofexperience),
  offer_studylevel: yup
    .string()
    .oneOf(Global.STUDIES_LEVEL, "Niveau d'étude non valide")
    .required(Global.STRINGS.recquired_ofstudie),
  offer_languages: yup.array().min(1, "Vous devez spécifier une langue"),
  offer_profildesc: yup.string().required(Global.STRINGS.recquired_profdesc),
  offer_desc: yup.string().required(Global.STRINGS.recquired_ofdesc),
  offer_title: yup.string().required(Global.STRINGS.recquired_oftitle),
  offer_status: yup.string(standarError),
  offer_endDate: yup.date().when("offer_status", {
    is: (val) => val == "programmé",
    then: yup
      .date(standarError)
      .required(Global.STRINGS.recquired_sheduledOferWothoutDate),
    otherwise: yup.date(standarError),
  }),
  offer_startDate: yup.date().when("offer_status", {
    is: (val) => val == "programmé",
    then: yup
      .date(standarError)
      .required(Global.STRINGS.recquired_sheduledOferWothoutDate),
    otherwise: yup.date(standarError),
  }),
  poster: yup.mixed(),
};

const signupCompanydefault = {
  ...userdefault,
  zipCode: yup.string().required(Global.STRINGS.recquired_zip),
  companyname: yup.string().required(Global.STRINGS.recquired_companyname),
  description: yup.string().required(Global.STRINGS.recquired_companydes),
  activities: yup
    .array()
    .max(6, Global.STRINGS.long_companyacti)
    .required(Global.STRINGS.recquired_companyacti),
  ent_civility: yup.string().oneOf(Global.ENT_CIVILITIES),
  phone1: yup.string().required(Global.STRINGS.recquired_phone1),
  phone2: yup.string(),
  ownlastname: yup.string(),
  ownfirstname: yup.string(),
  ownphone: yup.string(),
  own_civility: yup.string().oneOf(Global.PERS_CIVILITIES),
  ownemail: yup.string().email(),
};
const SCHEMAS = {
  schemaSignUpUser: yup.object().shape(
    {
      user_email: yup.string().email(Global.STRINGS.not_mail),
      user_pass: yup
        .string()
        .min(6, Global.STRINGS.small_pass)
        .required(Global.STRINGS.recquired_pass),
      identity: yup.string().required(Global.STRINGS.recquired_city),
    }
  ),
  schemaAddOffer: yup.object().shape({ ...addoferdefault }),
  schemaUpdateOffer: yup.object().shape(addoferdefault),
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
  schemaBecomeFormator: yup.object().shape({
    firstname: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    lastname: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    age: yup
      .number("Entrez une valeur correcte")
      .required("champ recquis")
      .min(1, Global.STRINGS.constrain_string_size("min", 1))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    job: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    country: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    mail: yup
      .string()
      .required("champ recquis")
      .email("Addresse e-mail Invalid")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    phone: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    creditCard: yup
      .string()
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(300, Global.STRINGS.constrain_string_size("max", 300)),
    formation_domain: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(200, Global.STRINGS.constrain_string_size("max", 200)),
    formation_title: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    course_description: yup.string().required("champ recquis"),
    cibled_public: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    course_impact: yup
      .string()
      .required("champ recquis")
      .min(2, Global.STRINGS.constrain_string_size("min", 2))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    motivation_reason: yup.string().required("champ recquis"),
    experience_year: yup
      .number("Entrez une valeur correcte")
      .required("champ recquis")
      .min(1, Global.STRINGS.constrain_string_size("min", 1))
      .max(100, Global.STRINGS.constrain_string_size("max", 100)),
    skill_level: yup
      .string()
      .required("champ recquis")
      .oneOf(["basic", "moyen", "elevé"], "Sélectionnez une réponse"),
    equipement_level: yup
      .string()
      .required("champ recquis")
      .oneOf(["none", "yes_phone", "yes_camera"], "Sélectionnez une réponse"),
    accompagnable_online: yup
      .string()
      .required("champ recquis")
      .oneOf(["Oui", "Non"], "Sélectionnez une réponse"),
    presential_course: yup
      .string()
      .required("champ recquis")
      .oneOf(["Oui", "Non"], "Sélectionnez une réponse"),
  }),
  schemaSignIn: yup.object().shape({
    user_email: yup
      .string()
      .min(3, Global.STRINGS.small_username)
      .max(50, Global.STRINGS.long_username),
    user_pass: yup.string().required(Global.STRINGS.recquired_pass),
  }),
  UserUpdate: yup.object().shape({
    username: yup
      .string()
      .min(3, Global.STRINGS.small_username)
      .max(50, Global.STRINGS.long_username),
    user_email: yup.string().email(Global.STRINGS.not_mail),
    user_firtname: yup
      .string()
      .min(3, Global.STRINGS.small_firstname)
      .max(50, Global.STRINGS.long_firstname),
    user_lastname: yup
      .string()
      .min(3, Global.STRINGS.small_lastname)
      .max(50, Global.STRINGS.long_lastname),
    display_name: yup
      .string()
      .min(3, Global.STRINGS.small_displayname)
      .max(50, Global.STRINGS.long_displayname),
    description: yup.string(),
    job: yup.string(),
    user_url: yup.string(),
    user_registered: yup.date(),
    user_status: yup.string().url(Global.STRINGS.not_url),
  }),
  schemaRessetPass: yup.object().shape({
    user_email: yup.string().required("").email(Global.STRINGS.not_mail),
  }),
  UserUpdateMedta: yup.object().shape({
    option: yup
      .string()
      .required()
      .oneOf(
        [
          "curiculum",
          "diploma",
          "formations",
          "experiences",
          "skills",
          "hobies",
          "languages",
        ],
        "invalid option"
      ),
  }),
  schemaExpérience: yup.object().shape({
    option: yup.string(),
    company: yup.string(),
    position: yup.string(),
    city: yup.string(),
    description: yup.string(),
    currentlyWork: yup.bool(),
    from: yup.date().required(standarError),
    to: yup.date().when("from", {
      is: (from) => !!from,
      then: yup
        .date()
        .required(standarError)
        .min(
          yup.ref("from"),
          "La date de fin ne peut antéceder la date de debut"
        ),

      otherwise: yup.date(standarError),
    }),
  }),
  schemaFormation: yup.object().shape({
    school: yup.string(),
    degree: yup.string(),
    field: yup.string(),
    city: yup.string(),
    country: yup.string(),
    currentlyWork: yup.bool(),
    from: yup.date().required(standarError),
    to: yup.date().when("from", {
      is: (from) => !!from,
      then: yup
        .date()
        .required(standarError)
        .min(
          yup.ref("from"),
          "La date de fin ne peut antéceder la date de debut"
        ),

      otherwise: yup.date(standarError),
    }),
  }),
  schemaSkill: yup.object().shape({
    title: yup.string(),
    level: yup.number(),
  }),
  schemaCuriculum: yup.object().shape({
    title: yup.string(),
    description: yup.string(standarError),
  }),
  FormatorMeta: yup.object().shape({
    option: yup.string().required().oneOf(["portfeuille"], "invalid option"),
  }),
  Querries: {
    Admin: {
      offers: yup.object().shape({
        label: yup
          .string()
          .required()
          .oneOf(
            [
              "meta_status",
              "posted_date",
              "offer_startDate",
              "offer_endDate",
              "visibility",
              "last_connected",
              "user_registered",
            ],
            "invalid option"
          ),
        value: yup.mixed().when("label", {
          is: (label) => !!label,
          then: yup.mixed().nullable(),
        }),
      }),
      Demands: yup.object().shape({
        label: yup
          .string()
          .required()
          .oneOf(
            [
              "status",
              "post_date",
              "response.date",
              "targetDelete",
              "response",
            ],
            "invalid option"
          ),
        value: yup.mixed().when("label", {
          is: (label) => !!label,
          then: yup.mixed().nullable(),
        }),
      }),
    },
    Public: {
      offers: yup.object().shape({
        label: yup
          .string()
          .required()
          .oneOf(
            [
              "posted_date",
              "categories",
              "companyID",
              "offer_startDate",
              "offer_endDate",
              "offer_status",
            ],
            "invalid option"
          ),
        value: yup.mixed().when("label", {
          is: (label) => !!label,
          then: yup.mixed().nullable(),
        }),
      }),
      users: yup.object().shape({
        label: yup
          .string()
          .required()
          .oneOf(
            ["categories", "explevel", "studylevel", "offer_status"],
            "invalid option"
          ),
        value: yup.mixed().when("label", {
          is: (label) => !!label,
          then: yup.mixed().nullable(),
        }),
      }),
    },
  },
  SendMessageContact: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .error(() => {
        throw Global.STRINGS.small_username;
      }),
    objet: Joi.string()
      .min(3)
      .error(() => {
        throw Global.STRINGS.invalid_object;
      }),
    user_email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .error(() => {
        throw Global.STRINGS.not_mail;
      }),
    message: Joi.string()
      .min(10)
      .error(() => {
        throw Global.STRINGS.invalid_message;
      }),
  }),
  CouponSheme: Joi.object({
    label: Joi.string()
      .max(205)
      .min(3)
      .error(() => {
        throw Global.STRINGS.constrain_string_size("min,max", "3,205");
      }),
    start_date: Joi.date().error(standarError),
    end_date: Joi.date().error(standarError),
    percentage_reduct: Joi.number().error(standarError),
    min_amount: Joi.number().error(standarError),
  }),
  CourseObject: Joi.object({
    c_title: Joi.string()
      .max(150)
      .error(() => {
        throw Global.STRINGS.invalid_course_name;
      }),
    c_category: Joi.number().error(() => {
      throw Global.STRINGS.invalid_course_category;
    }),
    c_post_date: Joi.date().error(() => {
      throw Global.STRINGS.invalid_course_date;
    }),
    c_duration: Joi.object().error(() => {
      throw Global.STRINGS.invalid_course_duration;
    }),
    menu_order: Joi.number().error(standarError),
    c_short_des: Joi.string().error(standarError),
    c_name: Joi.string().error(standarError),
    c_corverurl: Joi.string().error(standarError),
    corver_vid: Joi.string().error(standarError),
    c_overview: Joi.string().error(standarError),
  }),
  OfferParams: Joi.object({
    offer_status: Joi.string()
      .valid("programmé", "active", "inactive")
      .error(() => {
        throw "Status invalid";
      }),
  }),
  OfferParamsAdmin: Joi.object({
    meta_status: Joi.string()
      .valid(...meta_status_valus)
      .error(() => {
        throw "Status invalid";
      }),
  }),
  ApplyToOffer: Joi.object({
    title: Joi.string().allow("").error(standarError),
    description: Joi.string().error(standarError),
    file: Joi.string().allow("").error(standarError),
  }),
  ApplyToCandidate: Joi.object({
    offer_title: Joi.string().error(standarError),
    companyname: Joi.string().allow("").error(standarError),
    offerID: Joi.number().error(standarError),
    message: Joi.string().error(() => {
      throw "Vous devez saisir un meage valide";
    }),
    offer: Joi.object().error(standarError),
  }),
  LessonSchema: Joi.object({
    post_status: Joi.string().error(standarError),
    post_title: Joi.string().error(standarError),
    menu_order: Joi.number().error(standarError),
    post_content: Joi.string().error(standarError),
    mediaUrl: Joi.string().error(standarError),
    duration: Joi.object().error(standarError),
    post_diplay_type: Joi.object().error(standarError),
  }),
  Publicite: Joi.object({
    imgurl: Joi.string()
      .uri()
      .error(() => {
        throw Global.STRINGS.not_url;
      }),
    t1: Joi.string()
      .max(150)
      .min(3)
      .error(() => {
        throw Global.STRINGS.constrain_string_size("min,max", "3,150");
      }),
    t2: Joi.string()
      .max(205)
      .min(3)
      .error(() => {
        throw Global.STRINGS.constrain_string_size("min,max", "3,205");
      }),
    ids: Joi.array().error(() => {
      throw Global.STRINGS.constrain_string_size("min,max", "3,205");
    }),
  }),
  Category: Joi.object({
    corverUrl: Joi.string()
      .uri()
      .error(() => {
        throw Global.STRINGS.not_url;
      }),
    name: Joi.string()
      .required()
      .max(120)
      .min(3)
      .error(() => {
        throw Global.STRINGS.constrain_string_size("min,max", "3,120");
      }),
    description: Joi.string(),
    menu_order: Joi.number().error(standarError),
  }),
  Article: Joi.object({
    post_image: Joi.string()
      .uri()
      .error(() => {
        throw Global.STRINGS.not_url;
      }),
    post_title: Joi.string()
      .required()
      .max(120)
      .min(3)
      .error(() => {
        throw Global.STRINGS.constrain_string_size("min,max", "3,120");
      }),
    post_content: Joi.string(),
  }),
  MesNoti: Joi.object({
    objet: Joi.string()
      .required()
      .max(120)
      .min(3)
      .error(() => {
        throw Global.STRINGS.constrain_string_size("min,max", "3,120");
      }),
    content: Joi.string(),
    id_desti: Joi.number().error(standarError),
  }),
};
function standarError(e) {
  throw Global.STRINGS.Ocurred_error + e;
}
module.exports = SCHEMAS;
