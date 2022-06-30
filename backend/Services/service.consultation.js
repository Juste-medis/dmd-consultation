const HelperFile = require("../helpers/fileUtils");
const Helper = require("../helpers/utils");
const Global = require("../Ressources/fr/Globals");
const Scheme = require("../models/schemas");
const { Offer } = require("../models/DefaultModel");
const assert = require("assert");
const incrementor = require("../helpers/id_incrementor");
const { Numberrise } = require("../helpers/utils");
const { isAdmin, hasPostOffer } = require("../helpers/dbUtils");
const { updateOfferStatus } = require("../helpers/Updater");
const reader = require("xlsx");

async function getLines(req) {
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
  return { lines: data.length };
}
async function getAllStuff(req) {
  await updateOfferStatus();
  let { level, query } = req.query,
    abpro = {
      meta_status: {
        $nin: ["review", "rejected", "blocked"],
      },
    },
    sopro = {};

  if (query) {
    query = JSON.parse(query);
    var { find, sort } = query;
    for (let fi = 0; fi < find.length; fi++) {
      let data = { label: find[fi].key, value: find[fi].value };
      //<><><><><><><><><><><><><>securitaire<><><><><><><><><><><><><><><>
      await Scheme.Querries.Public.offers.validate(data);
      data = Numberrise(data);
      //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
      if (data.value?.length > 0 || typeof data.value === "object") {
        abpro[data.label] = data.value;
      }
    }
    for (let fi = 0; fi < sort.length; fi++) {
      sopro[sort[fi].key] = sort[fi].value;
    }
  }
  const offers = await global.dbo
    .collection("dmd_offers")
    .find(abpro, { projection: { _id: 0, meta_status: 0 } })
    .sort(Object.keys(sopro).length === 0 ? { posted_date: -1 } : sopro)
    .toArray();
  for (let i = 0; i < offers.length; i++) {
    const { companyname } = await global.dbo
      .collection("dmd_companies")
      .findOne({ ID: offers[i].companyID }, { projection: { companyname: 1 } });
    offers[i].companyname = companyname;
  }

  return offers;
}

//--------------------------------offer------------------------------------
async function addConsultation(req) {
  var formidable = require("formidable");
  var form = formidable.IncomingForm();
  let userId = req.params.userId;
  var formfields = await new Promise(function (resolve, reject) {
    form.parse(req, async function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      try {
        //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
        fields.categories = JSON.parse(fields.categories);
        fields.offer_languages = JSON.parse(fields.offer_languages || "[]");
        fields.offer_contrattype = JSON.parse(fields.offer_contrattype);
        /*
        fields.offer_desc = "rale booooo";
        fields.offer_profildesc = "JSON.parse(fields.fezze)";
*/
        fields = Numberrise(fields);
        //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
        await Scheme.schemaaddConsultation.validate(fields);
        fields = Helper.SimilObject(Offer, fields);
        //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
        let poster = files.poster;
        if (poster) {
          let isValid = HelperFile.validateFile(
            poster,
            HelperFile.isImage,
            Global.CONSTANT.COURSE_CORVER_IMAGE_MAX_SIZE
          );
          if (typeof isValid === "boolean") {
            let okfilename = HelperFile.file_namefy(
              "media/offer/posters",
              poster.name
            );
            HelperFile.File_Mover(poster.path, okfilename);
            fields.poster = `${req.protocol}://${req.get(
              "host"
            )}/${okfilename}`;
          } else {
            reject(isValid);
          }
        }
        let newID = (await incrementor("dmd_offers")) + 1;
        let newOffer = {
          ...Offer,
          ...fields,
          ID: newID,
          offer_status: fields.offer_status || "inactive",
          companyID: userId,
        };
        global.dbo
          .collection("dmd_offers")
          .insertOne(newOffer, function (err, res) {
            if (err) reject(err);
            resolve(newOffer);
          });
      } catch (error) {
        reject(error);
      }
    });
  });

  if (formfields.ID) {
    return formfields;
  } else {
    throw formfields;
  }
}

module.exports = {
  getAllStuff,
  addConsultation,
  getLines,
};
