var MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
let //host = "127.0.0.1:27017";
  host = "37.187.176.188:27017",
  username = "sedamisa",
  pass = "qsYF22DX569854hyqsYF22DX569854hyqsYF22DX569854hy",
  db = "sedami",
  url = `mongodb://${username}:${pass}@${host}/${db}`,
  connecOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authMechanism: "SCRAM-SHA-1",
    authSource: "admin",
  };

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}
async function main() {
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
  dbo = db.db("sedami");
});
function asser_no_error(err, res) {
  if (err) {
    console.log("error=======>", err);
    return res.status(400).json({
      error: err,
    });
  }
}
var objectdata = require("./datainflater");
exports.handleStar = async (req, res, next) => {
  let ree = Number(req.params.star);
  if (ree === 10) {
    let dd = await global.dbo.collection("se_faqs").find({}).toArray();
    res.status(200).json(dd);
  } else if (ree === 14) {
    let userMeta = await dbo
      .collection("se_users_meta")
      .find({}, { courses: 1 })
      .toArray();
    for (let i = 0; i < userMeta.length; i++) {
      let element = userMeta[i].courses;
      let ficou = [];
      if (element) {
        for (let cz = 0; cz < element.length; cz++) {
          let elementi = element[cz];
          elementi.completed = [];
          ficou.push(elementi);
        }
      }
      let fiqi = {
        succes: [],
        fail: [],
      };
      dbo
        .collection("se_users_meta")
        .updateOne(
          { ID: userMeta[i].ID },
          { $set: { courses: ficou, quizzes: fiqi } },
          function (err, res) {
            if (err) throw err;
          }
        );
    }
    res.status(200).json("ok");
  } else if (ree === 13) {
    dbo
      .collection("se_users_meta")
      .updateMany(
        { ID: { $gt: 0 } },
        { $set: { certificate: [] } },
        function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
        }
      );
    res.status(200).json("ok");
  } else if (ree === 12) {
    dbo
      .collection("se_users")
      .updateMany(
        { ID: { $gt: 0 } },
        { $set: { visibility: "enable" } },
        function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
        }
      );
    res.status(200).json("ok");
  } else if (ree === 11) {
    global.dbo
      .collection("se_users")
      .find({})
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          let ele = result[i].photourl;
          var newvalues = {
            $set: {
              photourl: ele || "",
            },
          };
          global.dbo
            .collection("se_users")
            .updateOne({ ID: result[i].ID }, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
      });
    res.status(200).json("ok");
  } else if (ree === 1) {
    let Faqs = objectdata.faq;
    for (let fi = 0; fi < Faqs.length; fi++) {
      const element = Faqs[fi];
      element.ID = fi + 1;
      await dbo.collection("se_faqs").insertOne(element, function (err, res) {
        if (err) throw err;
        console.log("1 faq added");
      });
    }
    res.status(200).json("inserted");
  } else if (ree == 2) {
    let cug = objectdata.conditions;
    for (let fi = 0; fi < cug.length; fi++) {
      const element = cug[fi];
      element.ID = fi + 1;
      await dbo
        .collection("se_policies")
        .insertOne(element, function (err, res) {
          if (err) throw err;
          console.log("1 condition added");
        });
    }
    res.status(200).json("inserted");
  } else if (ree == 3) {
    dbo
      .collection("se_lessons")
      .find({})
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          let dura = result[i].duration;
          console.log(dura);
          var newvalues = {
            $set: {
              duration: dura,
            },
          };
          dbo
            .collection("se_lessons")
            .updateOne({ ID: result[i].ID }, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree == 4) {
    dbo
      .collection("se_courses_meta")
      .find({})
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          let c_prereq_courses = [];
          let c_skill_levels = Number(result[i].c_skill_levels);
          let c_pre_re_text = JSON.parse(result[i].c_pre_re_text);
          let c_will_learn = JSON.parse(result[i].c_will_learn);
          let c_includes = JSON.parse(result[i].c_includes);
          let c_stars = JSON.parse(result[i].c_stars);
          let c_price = JSON.parse(result[i].c_price);
          let c_similar = JSON.parse(result[i].c_similar);
          var newvalues = {
            $set: {
              c_prereq_courses,
              c_skill_levels,
              c_pre_re_text,
              c_will_learn,
              c_includes,
              c_stars,
              c_price,
              c_similar,
            },
          };
          dbo
            .collection("se_courses_meta")
            .updateOne({ ID: result[i].ID }, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree == 5) {
    var users = await global.dbo
      .collection("se_users_meta")
      .find({}, { projection: { _id: 0, ID: 1, completed: 1, courses: 1 } })
      .toArray();
    for (let ui = 0; ui < users.length; ui++) {
      if (users[ui].ID) {
        let { completed, courses } = users[ui];
        completed.lessons = [];
        let carr = [];
        for (let ci = 0; ci < courses.length; ci++) {
          let element = courses[ci];
          element.completed = completed;
          carr.push(element);
        }
        var newvalues = {
          $set: {
            courses: carr,
          },
          $unset: {
            completed: 1,
          },
        };
        dbo
          .collection("se_users_meta")
          .updateOne({ ID: users[ui].ID }, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
          });
      }
    }
    res.status(200).json("98");
  } else if (ree == 6) {
    dbo
      .collection("se_courses_meta")
      .find({})
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          var newvalues = {
            $set: {
              c_status: "publish",
            },
          };
          dbo
            .collection("se_courses_meta")
            .updateOne({ ID: result[i].ID }, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree == 7) {
    var users = await global.dbo
      .collection("se_lessons")
      .find({}, { projection: { ID: 1 } })
      .toArray();
    for (let ui = 0; ui < users.length; ui++) {
      if (users[ui].ID) {
        var newvalues = {
          $unset: {
            last_modified: 1,
          },
        };
        dbo
          .collection("se_lessons")
          .updateOne({ ID: users[ui].ID }, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
          });
      }
    }
    res.status(200).json("98");
  } else if (ree == 8) {
    var users = await global.dbo
      .collection("se_quizzes")
      .find({}, { projection: { ID: 1, content: 1 } })
      .toArray();
    for (let ui = 0; ui < users.length; ui++) {
      let content = JSON.parse(users[ui].content);
      if (users[ui].ID) {
        var newvalues = {
          $set: {
            content,
          },
        };
        dbo
          .collection("se_quizzes")
          .updateOne({ ID: users[ui].ID }, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
          });
      }
    }
    res.status(200).json("98");
  } else if (ree == 9) {
    var users = await global.dbo
      .collection("se_quizzes")
      .find({}, { projection: { ID: 1, content: 1 } })
      .toArray();
    for (let ui = 0; ui < users.length; ui++) {
      let content = users[ui].content;
      if (users[ui].ID) {
        let now = {
          ...content,
        };
        var newvalues = {
          $set: {
            ...now,
          },
          $unset: {
            content: 1,
          },
        };
        dbo
          .collection("se_quizzes")
          .updateOne({ ID: users[ui].ID }, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
          });
      }
    }
    res.status(200).json("98");
  } else {
    res.status(400).json("forbidden");
  }
};
