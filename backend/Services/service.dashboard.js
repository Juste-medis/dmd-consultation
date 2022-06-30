const Helper = require("../helpers/utils");
const Scheme = require("../models/schemas");
var assert = require("assert");
const { isAdmin } = require("../helpers/dbUtils");
const { group_arr, Numberrise, date_to_string } = require("../helpers/utils");

const { updateOfferStatus } = require("../helpers/Updater");
const reader = require("xlsx");
const { Consultation, Consultation_raw } = require("../models/DefaultModel");
const { readFromDisc } = require("../helpers/fileUtils");
const incrementor = require("../helpers/id_incrementor");

exports.getConsultations = async (req) => {
  //<><><><><><><><><><><><><><><>><><><><><><><><><><><><><><><><><>
  let { query, page } = req.query;
  let loadingMasq = await global.dbo
    .collection("dmd_params")
    .findOne({ key: "fileLoading" });
  if (loadingMasq) {
    let { value, date } = loadingMasq;
    let nowDate = Date.now();
    let operationDistance = nowDate - date;
    if (operationDistance < value) {
      return {
        wait_message:
          "Veillez patienter le temps de chargement du fichier des données !",
        duration: value - operationDistance,
      };
    }
  }
  let abpro = {},
    sopro = {};
  if (query) {
    query = JSON.parse(query);
    var { find, sort } = query;
    for (let fi = 0; fi < find.length; fi++) {
      let data = { label: find[fi].key, value: find[fi].value };
      if (data.value?.length > 0 || typeof data.value === "object") {
        abpro[data.label] = data.value;
      }
    }
    for (let fi = 0; fi < sort.length; fi++) {
      sopro[sort[fi].key] = sort[fi].value;
    }
  }
  if (abpro.s) {
    let searchReg = new RegExp(`${abpro.s}`);
    abpro = {
      $or: [
        {
          code: searchReg,
        },
        { cons_label: searchReg },
        { cons_management: searchReg },
        { cons_support: searchReg },
        { cons_description: searchReg },
        { cons_date: searchReg },
      ],
    };
  }

  const skiping = page > 0 ? (page - 1) * 50 : 0;

  const consultations = await global.dbo
    .collection("dmd_consultations")
    .find(abpro, { projection: { _id: 0 } })
    .sort(Object.keys(sopro).length === 0 ? { code: -1 } : sopro)
    .skip(skiping)
    .limit(skiping === 0 ? 60 : 50)
    .toArray();

  return consultations;
};
exports.populateConsultation = async (req) => {
  //<><><><><><><><><><><><><><><>><><><><><><><><><><><><><><><><><>
  let { option } = req.params;
  if (option === "loadData") {
    let readingParams = await readFromDisc("files/data.xls");
    const file = reader.readFile("files/data.xls");
    global.dbo
      .collection("dmd_params")
      .updateOne(
        { key: "fileLoading" },
        { $set: { value: 30000 || readingParams.time, date: Date.now() } },
        function (err, res) {
          if (err) throw err;
        }
      );

    let data = [];
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]], {
        dateNF: "dd/mm/YYYY",
        raw: false,
      });
      temp.forEach((res) => {
        data.push(res);
      });
    }
    for (let ci = 0; ci < data.length; ci++) {
      let cons = data[ci];

      if (
        !(await global.dbo
          .collection("dmd_consultations")
          .findOne({ code: Number(cons.Code) }))
      ) {
        let consultationdata = Numberrise(
          Helper.SimilObject(Consultation_raw, cons)
        );
        consultationdata.code = consultationdata.Code;
        consultationdata.cons_label = consultationdata.Label;
        consultationdata.cons_description = consultationdata.Description;
        consultationdata.cons_management = consultationdata.Management;
        consultationdata.cons_support = consultationdata.Support;
        consultationdata.cons_date = consultationdata.Date;

        consultationdata = Helper.SimilObject(Consultation, consultationdata);

        let newCons = {
          ...Consultation,
          ...consultationdata,
        };

        await global.dbo
          .collection("dmd_consultations")
          .insertOne(newCons, function (err, res) {
            if (err) throw err;
          });
      }
    }

    // require("./service.mailing").SendMail({
    //   to: user_email,
    //   message: `Un (de) nouvel(nouveaux) enregistrement depuis un fichier chargé ddans la base de donnée en date de ${date_to_string(
    //     new Date(Date.now()).toISOString()
    //   )}`,
    //   subject: "Chargement de fichier",
    // });

    return 1;
  } else {
    let consultParam = req.body;
    //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    await Scheme.schemaAddConsultation.validate(consultParam);
    //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

    let newID = await incrementor("dmd_consultations", "code");
    newID++;

    let consultationdata = Helper.SimilObject(Consultation, consultParam),
      newCons = {
        ...Consultation,
        ...consultationdata,
        code: newID,
      };

    await global.dbo
      .collection("dmd_consultations")
      .insertOne(newCons, function (err, res) {
        if (err) throw err;
      });

    return newCons;
  }
};
exports.getSuperAdminOption = async (req) => {
  //<><><><><><><><><><><><><><><>><><><><><><><><><><><><><><><><><>
  let { userId, option } = req.params;

  var usarr = await global.dbo
    .collection("dmd_users")
    .find({}, { projection: { _id: 0 } })
    .sort({ user_registered: -1 })
    .toArray();
  for (let i = 0; i < usarr.length; i++) {
    let actuser = usarr[i];

    let { identity, phone1 } = await global.dbo
      .collection("dmd_users")
      .findOne({ ID: actuser.ID }, { projection: { _id: 0 } });
    delete actuser.user_pass;

    let session_difference =
      (new Date(Date.now()) - new Date(actuser.last_connected)) / 1000;

    usarr[i] = {
      ...actuser,
      name: `${identity}`,
      phone: `${phone1}`,
      email: actuser.user_email,
      joined: actuser.user_registered,
      isConnected: session_difference < 180,
    };
  }
  return usarr;
};

exports.AGetStatistics = async (req) => {
  let { query } = req.query,
    abpro = {},
    sopro = {},
    numbergen = 5;
  if (query) {
    query = JSON.parse(query);
    var { find, sort } = query;
    for (let fi = 0; fi < find.length; fi++) {
      let data = { label: find[fi].key, value: find[fi].value };
      //<><><><><><><><><><><><><>securitaire<><><><><><><><><><><><><><><>
      await Scheme.Querries.Admin.offers.validate(data);
      //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
      if (data.value?.length > 0 || typeof data.value === "object") {
        abpro[data.label] = data.value;
      }
    }
    for (let fi = 0; fi < sort.length; fi++) {
      sopro[sort[fi].key] = sort[fi].value;
    }
  }
  await updateOfferStatus();
  //--------------------------offres-----------------------------------
  const offers = await global.dbo
    .collection("dmd_offers")
    .find(abpro, { projection: { posted_date: 1 } })
    .toArray();
  let offerdata = {
    id: 1,
    title: "Offres",
    amount: offers.length,
    target: `${offers.length} sur ${offers.length}`,
    icon: "capsules",
    caret: "caret-up",
    color: "primary",
    caretColor: "success",
    data: group_arr(offers, "posted_date").map((mes) => mes.games.length),
  };
  //--------------------------offres-----------------------------------

  //--------------------------utilisateur-----------------------------------
  var usarr = await global.dbo
    .collection("dmd_users")
    .find(
      Object.keys(abpro).length === 0
        ? {}
        : { user_registered: abpro.posted_date },
      { projection: { _id: 0 } }
    )
    .sort(
      Object.keys(sopro).length === 0
        ? { user_registered: -1 }
        : { user_registered: sopro.posted_date }
    )
    .toArray();
  let userdata = {
    id: 2,
    title: "Utilisateurs",
    amount: usarr.length,
    target: `${usarr.length} sur ${usarr.length}`,
    icon: "capsules",
    caret: "caret-up",
    color: "primary",
    caretColor: "success",
    data: group_arr(usarr, "user_registered").map((mes) => mes.games.length),
  };

  if (usarr.length > 0) {
    usarr = usarr.slice(0, numbergen);
    for (let i = 0; i < numbergen; i++) {
      let actuser = usarr[i],
        computedname,
        user_type;
      if (actuser.user_type === "candidate") {
        let { firstname, lastname } = await global.dbo
          .collection("dmd_candidates")
          .findOne({ ID: actuser.ID }, { projection: { _id: 0 } });
        computedname = `${firstname} ${lastname}`;
        user_type = "Employé";
      } else if (actuser.user_type === "company") {
        let { companyname } = await global.dbo
          .collection("dmd_companies")
          .findOne({ ID: actuser.ID }, { projection: { _id: 0 } });
        computedname = `${companyname}`;
        user_type = "Entreprise";
      }
      usarr[i] = {
        avatar: {
          ...(actuser.avatar?.length > 0
            ? { img: actuser.avatar }
            : {
                name: `${computedname.substr(0, 2)}`.toUpperCase(),
              }),
        },
        ID: usarr[i].ID,
        user_type,
        name: `${computedname}`,
        email: actuser.user_email,
        joined: actuser.user_registered,
        user_status: actuser.visibility,
      };
    }
  }
  //--------------------------entreprises-----------------------------------
  var usarre = await global.dbo
    .collection("dmd_users")
    .find(
      {
        user_type: "company",
        ...(Object.keys(abpro).length === 0
          ? {}
          : { user_registered: abpro.posted_date }),
      },
      { projection: { _id: 0 } }
    )
    .sort(
      Object.keys(sopro).length === 0
        ? { user_registered: -1 }
        : { user_registered: sopro.posted_date }
    )
    .toArray();
  if (usarre.length > 0) {
    usarre = usarre.slice(0, numbergen);
    for (let i = 0; i < numbergen; i++) {
      let actuser = usarre[i],
        user_type = "",
        computedname;
      if (!actuser) {
        break;
      }
      let { companyname } = await global.dbo
        .collection("dmd_companies")
        .findOne({ ID: actuser.ID }, { projection: { _id: 0 } });
      computedname = `${companyname}`;
      user_type = "Entreprise";

      usarre[i] = {
        avatar: {
          ...(actuser.avatar?.length > 0
            ? { img: actuser.avatar }
            : {
                name: `${computedname.substr(0, 2)}`.toUpperCase(),
              }),
        },
        ID: usarre[i].ID,
        user_type,
        name: `${computedname}`,
        email: actuser.user_email,
        joined: actuser.user_registered,
        user_status: actuser.visibility,
      };
    }
  }
  //--------------------------entreprise-----------------------------------
  //--------------------------applications-----------------------------------
  var applyarr = await global.dbo
    .collection("dmd_applications")
    .aggregate([
      {
        $lookup: {
          from: "dmd_offers",
          localField: "targetID",
          foreignField: "ID",
          as: "meta",
        },
      },
      {
        $match:
          Object.keys(abpro).length === 0
            ? {}
            : { post_date: abpro.posted_date },
      },
      {
        $project: {
          "meta.offer_title": 1,
          "meta.companyID": 1,
          ID: 1,
          userId: 1,
          targetID: 1,
          post_date: 1,
          response: 1,
          targetDelete: 1,
        },
      },
    ])
    .sort(
      Object.keys(sopro).length === 0
        ? { post_date: -1 }
        : { post_date: sopro.posted_date }
    )
    .toArray();
  let applicationdata = {
    id: 3,
    title: "Candidatures",
    amount: applyarr.length,
    target: `${applyarr.length} sur ${applyarr.length}`,
    icon: "capsules",
    caret: "caret-up",
    color: "primary",
    caretColor: "success",
    data: group_arr(applyarr, "post_date").map((mes) => mes.games.length),
  };

  if (applyarr.length > 0) {
    applyarr = applyarr.slice(0, numbergen);
    for (let i = 0; i < numbergen; i++) {
      let appuser = await global.dbo
          .collection("dmd_users")
          .findOne(
            { ID: applyarr[i].userId },
            { projection: { _id: 0, avatar: 1 } }
          ),
        compuser = await global.dbo
          .collection("dmd_users")
          .findOne(
            { ID: applyarr[i].meta[0]?.companyID },
            { projection: { _id: 0, avatar: 1 } }
          );
      let candidate = await global.dbo.collection("dmd_candidates").findOne(
          { ID: applyarr[i].userId },
          {
            projection: {
              _id: 0,
              sexe: 1,
              firstname: 1,
              lastname: 1,
            },
          }
        ),
        company = await global.dbo.collection("dmd_companies").findOne(
          { ID: applyarr[i].meta[0]?.companyID },
          {
            projection: {
              _id: 0,
              companyname: 1,
            },
          }
        );
      Object.assign(
        applyarr[i],
        applyarr[i].meta[0],
        {
          cn_av: appuser?.avatar,
          co_av: compuser?.avatar,
        },
        candidate,
        company
      );
      let actuser = applyarr[i];

      applyarr[i] = {
        ID: applyarr[i].ID,
        candidate: {
          ID: actuser.userId,
          name: `${actuser.firstname} ${actuser.lastname}`,
          avatar: {
            ...(actuser.cn_av?.length > 0
              ? { img: actuser.cn_av }
              : {
                  name: `${
                    actuser.firstname[0] + actuser.lastname[0]
                  }`.toUpperCase(),
                }),
          },
        },
        company: {
          IDc: applyarr[i].meta[0]?.companyID,
          namec: actuser.companyname,
          avatarc: {
            ...(actuser.co_av?.length > 0
              ? { img: actuser.co_av }
              : {
                  name: `${actuser.companyname.substr(0, 2)}`.toUpperCase(),
                }),
          },
        },
        post_date: actuser.post_date,
        offer_title: actuser.offer_title,
        response: actuser.response,
        targetDelete: actuser.targetDelete,
        offerID: actuser.targetID,
      };
      delete applyarr[i].meta;
    }
  }
  return {
    usarr,
    usarre,
    applyarr,
    crmarr: { applicationdata, userdata, offerdata },
  };
};
