const Helper = require("../helpers/utils");
const Scheme = require("../models/schemas");
var assert = require("assert");
const { isAdmin } = require("../helpers/dbUtils");
const { group_arr, Numberrise, date_to_string } = require("../helpers/utils");

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
