const Helper = require("../helpers/utils");
const Scheme = require("../models/schemas");
var assert = require("assert");
const { isAdmin } = require("../helpers/dbUtils");
const { group_arr } = require("../helpers/utils");

const HelperFile = require("../helpers/fileUtils");
const Globals = require("../Ressources/fr/Globals");
const { updateOfferStatus } = require("../helpers/Updater");
const reader = require("xlsx");

exports.getConsultations = async (req) => {
  //<><><><><><><><><><><><><><><>><><><><><><><><><><><><><><><><><>
  let { userId, option } = req.params;
  const file = reader.readFile("files/data.xls");
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
  let { query } = req.query;
  let abpro = {},
    sopro = {}; //get statistic
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
  //todo
  return data;
};
exports.getSuperAdminOption = async (req) => {
  //<><><><><><><><><><><><><><><>><><><><><><><><><><><><><><><><><>
  let { userId, option } = req.params;
  let { query } = req.query;
  let abpro = {},
    sopro = {};

  //get statistic
  if (query) {
    query = JSON.parse(query);
    var { find, sort } = query;
    for (let fi = 0; fi < find.length; fi++) {
      let data = { label: find[fi].key, value: find[fi].value };
      //<><><><><><><><><><><><><>securitaire<><><><><><><><><><><><><><><>
      await Scheme.Querries.Admin.Demands.validate(data);
      //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
      if (
        data.value?.length > 0 ||
        typeof data.value === "object" ||
        typeof data.value === "boolean"
      ) {
        abpro[data.label] = data.value;
      }
    }
    for (let fi = 0; fi < sort.length; fi++) {
      sopro[sort[fi].key] = sort[fi].value;
    }
  }
  //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
  //option can be : users,applications,demands
  if (option == "users") {
    var usarr = await global.dbo
      .collection("dmd_users")
      .find({}, { projection: { _id: 0 } })
      .sort({ user_registered: -1 })
      .toArray();
    for (let i = 0; i < usarr.length; i++) {
      let actuser = usarr[i];
      if (actuser.user_type === "candidate") {
        let { firstname, phone, lastname } = await global.dbo
          .collection("dmd_candidates")
          .findOne({ ID: actuser.ID }, { projection: { _id: 0 } });
        usarr[i] = {
          ...actuser,
          user_type: "Employé",
          name: `${firstname} ${lastname}`,
          avatar: {
            ...(actuser.avatar?.length > 0
              ? { img: actuser.avatar }
              : {
                  name: `${firstname[0] + lastname[0]}`.toUpperCase(),
                }),
          },
          email: actuser.user_email,
          joined: actuser.user_registered,
        };
      } else if (actuser.user_type === "company") {
        let { companyname, phone1 } = await global.dbo
          .collection("dmd_companies")
          .findOne({ ID: actuser.ID }, { projection: { _id: 0 } });
        usarr[i] = {
          ...actuser,
          user_type: "Entreprise",
          name: `${companyname}`,
          phone: `${phone1}`,
          avatar: {
            ...(actuser.avatar?.length > 0
              ? { img: actuser.avatar }
              : { name: `${companyname?.substr(0, 2)}`.toUpperCase() }),
          },
          email: actuser.user_email,
          joined: actuser.user_registered,
        };
      }
    }
    return usarr;
  } else if (option == "applications") {
    var usarr = await global.dbo
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
        { $match: abpro },
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
      .sort(Object.keys(sopro).length === 0 ? { posted_date: -1 } : sopro)
      .toArray();
    for (let i = 0; i < usarr.length; i++) {
      let appuser = await global.dbo
          .collection("dmd_users")
          .findOne(
            { ID: usarr[i].userId },
            { projection: { _id: 0, avatar: 1 } }
          ),
        compuser = await global.dbo
          .collection("dmd_users")
          .findOne(
            { ID: usarr[i].meta[0]?.companyID },
            { projection: { _id: 0, avatar: 1 } }
          );
      let candidate = await global.dbo.collection("dmd_candidates").findOne(
          { ID: usarr[i].userId },
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
          { ID: usarr[i].meta[0]?.companyID },
          {
            projection: {
              _id: 0,
              companyname: 1,
            },
          }
        );
      Object.assign(
        usarr[i],
        usarr[i].meta[0],
        {
          cn_av: appuser?.avatar,
          co_av: compuser?.avatar,
        },
        candidate,
        company
      );
      let actuser = usarr[i];

      usarr[i] = {
        ID: usarr[i].ID,
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
          ID: usarr[i].meta[0]?.companyID,
          name: actuser.companyname,
          avatar: {
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
      delete usarr[i].meta;
    }
    return usarr;
  } else if (option == "demands") {
    var usarr = await global.dbo
      .collection("dmd_demands")
      .aggregate([
        {
          $lookup: {
            from: "dmd_users",
            localField: "targetID",
            foreignField: "ID",
            as: "meta",
          },
        },
        { $match: abpro },
        {
          $project: {
            "meta.avatar": 1,
            ID: 1,
            userId: 1,
            targetID: 1,
            offerID: 1,
            post_date: 1,
            response: 1,
            targetDelete: 1,
          },
        },
      ])
      .sort(Object.keys(sopro).length === 0 ? { posted_date: -1 } : sopro)
      .toArray();
    for (let i = 0; i < usarr.length; i++) {
      let appuser = await global.dbo
          .collection("dmd_users")
          .findOne(
            { ID: usarr[i].userId },
            { projection: { _id: 0, avatar: 1 } }
          ),
        company = await global.dbo.collection("dmd_companies").findOne(
          { ID: usarr[i].userId },
          {
            projection: {
              _id: 0,
              companyname: 1,
            },
          }
        );
      let canduser = await global.dbo
          .collection("dmd_candidates")
          .findOne(
            { ID: usarr[i].targetID },
            { projection: { _id: 0, sexe: 1, firstname: 1, lastname: 1 } }
          ),
        con_offer = await global.dbo
          .collection("dmd_offers")
          .findOne(
            { ID: usarr[i].offerID },
            { projection: { _id: 0, offer_title: 1 } }
          );

      Object.assign(
        usarr[i],
        usarr[i].meta[0],
        {
          cn_av: usarr[i].meta[0]?.avatar,
          co_av: appuser?.avatar,
        },
        canduser,
        con_offer,
        company
      );
      let actuser = usarr[i];
      usarr[i] = {
        ID: usarr[i].ID,
        candidate: {
          ID: actuser.targetID,
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
          ID: usarr[i].userId,
          name: actuser.companyname,
          avatar: {
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
        offerID: actuser.offerID,
      };
      delete usarr[i].meta;
    }
    return usarr;
  }
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
