var MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const { getRandomInt } = require("../../helpers/utils");

const host = "127.0.0.1:27017",
  //  host = "37.187.176.188:27017";
  username = "runexa",
  pass = "runexa_569854hyqsYF22DX569854hyqsYF22DX569854hyqsYF22DX",
  db = "runex",
  url = `mongodb://${username}:${pass}@${host}/${db}`,
  connecOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authMechanism: "SCRAM-SHA-1",
    authSource: "admin",
  };

async function main() {
  async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  }
  const client = new MongoClient(url, connecOption);
  try {
    await client.connect();
    await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
main().catch(console.error);

let dbo;
MongoClient.connect(url, connecOption, function (err, db) {
  assert.strictEqual(null, err);
  dbo = db.db("runex");
});

exports.handleStar = async (req, res, next) => {
  let ree = Number(req.params.star);
  if (ree === 10) {
    dbo.collection("dmd_demands").updateMany(
      { ID: { $gt: 0 } },
      {
        $set: {
          response: {
            decision: "",
            date: null,
          },
        },
      },
      function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      }
    );
    res.status(200).json(">>[ok]<<");
  } else if (ree === 13) {
    let comps = [
      { label: "maîtrise d’un logiciel", domain: "general" },
      { label: "réalisation d’un plan de financement", domain: "general" },
      { label: "gestion de projets", domain: "general" },
      { label: "niveau dans un langue étrangère", domain: "general" },
      { label: "management d’une équipe", domain: "general" },
      { label: "gestion de paie", domain: "general" },
      { label: "réalisation de bilan comptable", domain: "general" },
      { label: "relation clients", domain: "general" },
      { label: "esprit d’équipe", domain: "general" },
      { label: "autonomie", domain: "general" },
      { label: "esprit d’initiative", domain: "general" },
      { label: "créativité", domain: "general" },
      { label: "bienveillance au travail", domain: "general" },
      { label: "management", domain: "general" },
      { label: "prise de décision, négociation", domain: "general" },
      { label: "résistance au stress", domain: "general" },
      { label: "Java", domain: "informatique" },
      { label: "C", domain: "informatique" },
      { label: "Python", domain: "informatique" },
      { label: "React js", domain: "informatique" },
      { label: "Node js", domain: "informatique" },
      { label: "Vue js", domain: "informatique" },
      { label: "Django", domain: "informatique" },
      { label: "mongodb", domain: "informatique" },
      { label: "Laravel", domain: "informatique" },
      { label: "angular", domain: "informatique" },
      { label: "flutter", domain: "informatique" },
      { label: "dart", domain: "informatique" },
      { label: "pawerpoint", domain: "informatique" },
      { label: "words", domain: "informatique" },
      { label: "excel", domain: "informatique" },
      { label: "php", domain: "informatique" },
      { label: "uml", domain: "informatique" },
      { label: "vba", domain: "informatique" },
      { label: "perl", domain: "informatique" },
      { label: "ios", domain: "informatique" },
      { label: "android", domain: "informatique" },
      { label: "linux", domain: "informatique" },
      { label: "windows", domain: "informatique" },
      { label: "swift", domain: "informatique" },
    ];
    let imp = ["high", "moderated", "low"];

    for (let i = 0; i < comps.length; i++) {
      const element = comps[i];

      dbo.collection("dmd_keywords").insertOne(
        {
          ID: i + 1,
          label: element.label,
          domain: element.domain,
          value: element.label,
          importance: imp[getRandomInt(0, 2)],
          seached_time: getRandomInt(0, 100),
        },
        function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
        }
      );
    }

    res.status(200).json(">>[ok]<<");
  } else if (ree === 12) {
    dbo
      .collection("dmd_employees")
      .insertOne(
        { ID: 1, mail: "medisadido@gmail.com", address: "Abomey-Calavi" },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.status(200).json(">>[ok]<<");
  } else if (ree === 11) {
    dbo.collection("dmd_offers").updateMany(
      { ID: { $gt: 0 } },
      {
        $set: {
          offer_endDate: "2021-12-29T17:06:07.000Z",
          offer_startDate: "2021-12-22T17:06:07.000Z",
          offer_status: "active",
        },
      },
      function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      }
    );
    res.status(200).json(">>[ok]<<");
  } else {
    res.status(400).json("forbidden");
  }
};
