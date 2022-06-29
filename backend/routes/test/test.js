var MongoClient = require("mongodb").MongoClient;
var dbo;
var global_db;
MongoClient.connect(
  "mongodb://127.0.0.1:27017",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  function (err, db) {
    if (err) {
      throw err;
    }
    global_db = db;
    dbo = db.db("sedami");
    /*
    db.db("sedami")
      .collection("se_category")
      .find({}, { projection: { description: 0, menu_order: 0 } });
      */
  }
);

function closeDatabase() {
  global_db.close();
}
function asser_no_error(err, res) {
  if (err) {
    console.log("error=======>", err);
    return res.status(400).json({
      error: err,
    });
  }
}

function getRandomDate(from, to) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

exports.getAllStuff = async (req, res, next) => {
  let wilarr = [
    "La différence entre un site mono-produit et un site multi-produit",
    "Présentation de la plateforme Shopify (Partie 1)",
    "Présentation de la plateforme shopify (Partie 2)",
    "Paramétrage important à faire sur shopify",
    "Création des pages légale",
    "Personnalisation du thème",
    "Configuration d’oberlo (Partie 1)",
    "Configuration d’oberlo (Partie 2)",
    "Configuration de look review (Partie 1)",
    "Configuration de look review (Partie 2)",
    "Liste de contrôle de démarrage de votre boutique Shopify",
    "Liste de contrôle d’optimisation de conversion",
  ];
  let prere = [
    "No Special Skills Needed",
    "You Will Need a Visa card",
    "Pratice Can Not Be Avoides",
    "Vous pouvez indiquer votre langue de recherche sur la page Préférences.",
    "Connaître les bases du langage de programmation Python.",
  ];
  let ids = [];
  let other_courses = [];
  dbo
    .collection("se_courses_meta")
    .find({}, { projection: { _id: 1 } })
    .toArray(async function (err, result) {
      asser_no_error(err, res);
      result.forEach((element) => {
        ids.push(element._id);
      });
      for (let i = 0; i < Math.floor(Math.random() * 10) + 6; i++) {
        other_courses.push(ids[Math.floor(Math.random() * ids.length)]);
      }
      for (let i = 0; i < result.length; i++) {
        let element = result[i];
        var myquery = { _id: Number(result[i]._id) };
        let obj = {
          current: Math.floor(Math.random() * 220000) + 15000,
          promotion: Math.floor(Math.random() * 220000) + 15000,
          promo_date_start: getRandomDate(
            new Date("2020-02-12T01:57:45.271Z"),
            new Date("2021-12-12T01:57:45.271Z")
          ).toISOString(),
          promo_date_end: getRandomDate(
            new Date("2020-02-12T01:57:45.271Z"),
            new Date("2021-12-12T01:57:45.271Z")
          ).toISOString(),
        };
        await dbo
          .collection("se_sections")
          .find(
            { section_course_id: Number(result[i]._id) },
            { projection: { section_course_id: 1 } }
          )
          .toArray(async function (err, resultle) {
            if (resultle.length > 0) {
              var nosection = 0;
              for (let sisi = 0; sisi < resultle.length; sisi++) {
                const element = resultle[sisi];
                const count = await dbo
                  .collection("se_lessons")
                  .countDocuments({
                    section_id: element._id,
                  });
                nosection += count;
              }
              dbo.collection("se_courses_meta").updateOne(
                { _id: Number(result[i]._id) },
                {
                  $set: {
                    total_section: resultle.length,
                    total_lessons: nosection,
                  },
                },
                function (err, res) {
                  if (err) throw err;
                }
              );
            } else {
              dbo.collection("se_courses_meta").updateOne(
                { _id: Number(result[i]._id) },
                {
                  $set: {
                    total_section: 0,
                    total_lessons: 0,
                  },
                },
                function (err, res) {
                  if (err) throw err;
                }
              );
            }
          });

        var newvalues = {
          $set: {
            c_price: JSON.stringify(obj),
            c_will_learn: JSON.stringify(wilarr),
            c_pre_re_text: JSON.stringify(prere),
            c_similar: JSON.stringify(other_courses),
          },
        };
        dbo
          .collection("se_courses_meta")
          .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
          });
      }
      await res.status(200).json(result);
    });
};
exports.handleStar = async (req, res, next) => {
  console.log(req.params.star);
  console.log(req.query);

  let ree = Number(req.params.star);
  if (ree === 1) {
    //stars in se_comments_course
    dbo
      .collection("se_comments_course")
      .find({}, { projection: { ID: 1 } })
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          let element = result[i];
          let obj = Math.floor(Math.random() * 6) + 1;
          var myquery = { ID: Number(element.ID) };
          var newvalues = { $set: { stars: obj } };
          dbo
            .collection("se_comments_course")
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              //console.log("insee");
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree === 2) {
    console.log("computing c_stars in se_courses_meta");
    dbo
      .collection("se_courses")
      .find({}, { projection: { ID: 1 } })
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          let element = result[i];
          asser_no_error(err, res);
          let starso = [];
          for (let sti = 0; sti < 5; sti++) {
            const count = await dbo
              .collection("se_comments_course")
              .countDocuments({ course_id: element.ID, stars: sti + 1 });
            starso[sti] = count;
          }
          let obj = {
            s_1: starso[0],
            s_2: starso[1],
            s_3: starso[2],
            s_4: starso[3],
            s_5: starso[4],
          };
          obj.average = parseFloat(
            (
              (starso[0] +
                starso[1] * 2 +
                starso[2] * 3 +
                starso[3] * 4 +
                starso[4] * 5) /
              starso.reduce((a, b) => a + b, 1)
            ).toFixed(1)
          );
          const countc = await dbo
            .collection("se_comments_course")
            .countDocuments({ course_id: element.ID });
          obj.notes = countc;
          var myquery = { ID: Number(element.ID) };
          var newvalues = {
            $set: {
              c_stars: JSON.stringify(obj),
              c_includes: JSON.stringify({
                file: "Fichier de support",
                ilimity: "acces ilimité à vie",
                certificate: "Certificat de fin de formation",
                laptop: "Accès sur laptop, mobiles et TV",
                quizz: "verification de connaissances",
              }),
            },
          };
          dbo
            .collection("se_courses_meta")
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree === 3) {
    console.log("inflate se_pub");
    let imarr = [
      "https://sedami.com/wp-content/uploads/2020/09/e-commerce-link-building-1520x800-1.png",
    ];
    dbo
      .collection("se_pub")
      .find({}, { projection: { _id: 1 } })
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          var myquery = { _id: Number(result[i]._id) };
          var newvalues = {
            $set: {
              menu_order: i,
              action_text: "Découvrir",
              action_url: "https://sedami.com",
            },
          };
          dbo
            .collection("se_pub")
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree === 4) {
    console.log("se_courses imaages change");
    let imarr = [
      "https://sedami.com/wp-content/uploads/2020/09/e-commerce-link-building-1520x800-1.png",
      "https://sedami.com/wp-content/uploads/2020/09/tableau-de-bord.png",
      "https://sedami.com/wp-content/uploads/revslider/home-page/slide_51.jpg",
      "https://sedami.com/wp-content/uploads/2019/11/SEDAMI-32.jpg",
      "https://sedami.com/wp-content/uploads/2019/07/Freelance-scaled.jpeg",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d0ffdc3cbaaf.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d0c2903891a0.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d091c6101e53.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d08dea5a8d2e.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d06ba20a8fcf.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d04f5c34f20c-1024x606.png",
      "https://sedami.com/wp-content/uploads/2019/05/AdobeStock_187467657-e1543454443168-1024x606.jpg",
      "https://sedami.com/wp-content/uploads/2019/05/1_ZoTR6z9zpej22v1b0zGeqg-1024x673.jpeg",
      "https://sedami.com/wp-content/uploads/2019/05/Sans-titre-34.png",
      "https://sedami.com/wp-content/uploads/2019/05/photography-1850469_960_720.jpg",
      "https://sedami.com/wp-content/uploads/2019/04/SEDAMI-3-1-1024x576.png",
      "https://sedami.com/wp-content/uploads/2019/04/SEDAMI-1-1-1024x576.png",
      "https://sedami.com/wp-content/uploads/2016/01/hero_slide_3-1024x680.jpg",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d06bbf30f17b-1024x682.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d06c2bd065f8-1024x683.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d06d003ea3b3-1024x683.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d0752c1bb720.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d0777fb7eafd-1024x622.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d093eeb91855-1024x683.png",
      "https://sedami.com/wp-content/uploads/2019/06/img_5d0ac07fce12c.png",
      "https://sedami.com/wp-content/uploads/2019/06/actu-jeune-ivoirienne.jpg",
      "https://sedami.com/wp-content/uploads/2019/07/header_blog-1024x688.jpg",
      "https://sedami.com/wp-content/uploads/2019/06/Dudeonabeachworking-1-1024x887.jpg",
      "https://sedami.com/wp-content/uploads/2020/01/hgt.png",
      "https://sedami.com/wp-content/uploads/2020/01/hgt.png",
      "https://sedami.com/wp-content/uploads/2020/01/hgt.png",
    ];
    let vidararr = [
      "https://media.istockphoto.com/videos/connected-blue-data-network-4k-seamless-loop-video-id1270767960",
      "https://media.istockphoto.com/videos/portrait-of-female-doctor-smiling-and-showing-chroma-key-copy-space-video-id1307545842",
      "https://media.istockphoto.com/videos/asian-young-businesswoman-reporting-a-sales-report-video-id1306636274",
      "https://media.istockphoto.com/videos/portrait-of-indian-man-construction-worker-using-laptop-computer-video-id1307188719",
      "https://media.istockphoto.com/videos/animated-colored-pixel-concept-of-network-background-in-color-pink-video-id1308212767",
      "https://media.istockphoto.com/videos/portrait-young-girl-holding-laptop-lass-using-computer-at-home-six-video-id1307963827",
      "https://media.istockphoto.com/videos/network-animation-business-science-and-technology-video-id1308020662",
      "https://media.istockphoto.com/videos/animated-facebook-live-icon-template-theme-on-green-screen-background-video-id1309046792",
      "https://media.istockphoto.com/videos/female-hands-typing-on-computer-keyboard-sit-at-home-office-desk-video-id1297551049",
      "https://media.istockphoto.com/videos/programming-source-code-abstract-background-video-id1046965704",
      "https://media.istockphoto.com/videos/abstract-program-code-are-written-and-moved-in-the-virtual-space-video-id1256086140",
      "https://media.istockphoto.com/videos/portrait-of-muscular-handsome-businessman-wearing-suit-against-green-video-id1302759734",
    ];
    dbo
      .collection("se_courses")
      .find({}, { projection: { ID: 1 } })
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          let im = imarr[Math.floor(Math.random() * imarr.length)];
          let vi = vidararr[Math.floor(Math.random() * vidararr.length)];
          var myquery = { ID: Number(result[i].ID) };
          var newvalues = {
            $set: {
              c_corverurl: im,
              corver_vid: vi,
              menu_order: i,
            },
          };
          dbo
            .collection("se_courses")
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree === 5) {
    console.log("inflate se_features");
    let imarr = [
      "Accès illimité",
      "suppport video",
      "Enseignants experts",
      "suivit complet",
      "Soyez fou",
      "première place",
      "Grande vision",
      "Rêvez plus",
      "Accès illimité",
      "suppport video",
      "Enseignants experts",
      "suivit complet",
      "Soyez fou",
      "première place",
      "Grande vision",
      "Rêvez plus",
      "Accès illimité",
      "suppport video",
      "Enseignants experts",
      "suivit complet",
      "Soyez fou",
      "première place",
      "Grande vision",
      "Rêvez plus",
    ];
    let vidararr = [
      "Choisissez ce que vous souhaitez apprendre de notre vaste bibliothèque d'abonnements.",
      "Offrez à votre équipe un accès illimité à plus de 5 500 cours parmi les meilleurs de Sedami.",
      "Les meilleurs formateurs du monde donnent des cours à des millions de participants sur Sedami.",
      "Nous vous offrons les outils et les compétences nécessaires pour enseigner ce que vous aimez.",
      "Les formateurs sedami sont désireux de partager leurs connaissances et d'aider les participants. Ce sont des experts dans leur domaine qui restent impliqués afin de fournir le contenu le plus à jour.",
      "A Sedami, nous pensons que les meilleurs enseignants du monde ne se trouvent pas toujours dans les salles de classe. Nos formateurs viennent de presque tous les pays et proposent des cours dans plus de 65 langues sur quasiment tous les thèmes.",
      "sedami est la première place de marché internationale pour l'enseignement et l'apprentissage. Elle permet à des participants situés dans n'importe quel pays de bénéficier de la meilleure formation au monde.",
      "Notre sélection de cours professionnels et techniques parmi les mieux notés permet aux entreprises, aux gouvernements et aux organismes à but non lucratif de développer l'expertise en interne et de satisfaire la soif",
      "Choisissez ce que vous souhaitez apprendre de notre vaste bibliothèque d'abonnements.",
      "Offrez à votre équipe un accès illimité à plus de 5 500 cours parmi les meilleurs de Sedami.",
      "Les meilleurs formateurs du monde donnent des cours à des millions de participants sur Sedami.",
      "Nous vous offrons les outils et les compétences nécessaires pour enseigner ce que vous aimez.",
      "Les formateurs sedami sont désireux de partager leurs connaissances et d'aider les participants. Ce sont des experts dans leur domaine qui restent impliqués afin de fournir le contenu le plus à jour.",
      "A Sedami, nous pensons que les meilleurs enseignants du monde ne se trouvent pas toujours dans les salles de classe. Nos formateurs viennent de presque tous les pays et proposent des cours dans plus de 65 langues sur quasiment tous les thèmes.",
      "sedami est la première place de marché internationale pour l'enseignement et l'apprentissage. Elle permet à des participants situés dans n'importe quel pays de bénéficier de la meilleure formation au monde.",
      "Notre sélection de cours professionnels et techniques parmi les mieux notés permet aux entreprises, aux gouvernements et aux organismes à but non lucratif de développer l'expertise en interne et de satisfaire la soif",
      "Choisissez ce que vous souhaitez apprendre de notre vaste bibliothèque d'abonnements.",
      "Offrez à votre équipe un accès illimité à plus de 5 500 cours parmi les meilleurs de Sedami.",
      "Les meilleurs formateurs du monde donnent des cours à des millions de participants sur Sedami.",
      "Nous vous offrons les outils et les compétences nécessaires pour enseigner ce que vous aimez.",
      "Les formateurs sedami sont désireux de partager leurs connaissances et d'aider les participants. Ce sont des experts dans leur domaine qui restent impliqués afin de fournir le contenu le plus à jour.",
      "A Sedami, nous pensons que les meilleurs enseignants du monde ne se trouvent pas toujours dans les salles de classe. Nos formateurs viennent de presque tous les pays et proposent des cours dans plus de 65 langues sur quasiment tous les thèmes.",
      "sedami est la première place de marché internationale pour l'enseignement et l'apprentissage. Elle permet à des participants situés dans n'importe quel pays de bénéficier de la meilleure formation au monde.",
      "Notre sélection de cours professionnels et techniques parmi les mieux notés permet aux entreprises, aux gouvernements et aux organismes à but non lucratif de développer l'expertise en interne et de satisfaire la soif",
    ];
    for (let i = 0; i < vidararr.length; i++) {
      dbo
        .collection("se_features")
        .insertOne(
          { img: "faFacebook", head: imarr[i], sub: vidararr[i], ID: i + 1 },
          function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
          }
        );
    }
    res.status(200).json("inserted");
  } else if (ree === 6) {
    console.log("inflating se_courses");
    let sar = [
      "L’affiliation est un partenariat entre un éditeur de site et un site commercial cherchant à développer ses ventes en ligne ou capter un nombre de ",
      "demandes de devis plus important. Le site commercial, alors nommé « annonceur » propose un programme d’affiliation au site",
      "souhaitant revendre son trafic, alors nommé « affilié ». Ce programme d’affiliation décrit la manière dont l’affilié sera rémunéré en faisant la",
      "promotion des produits ou services de l’affilieur. ",
    ];

    dbo
      .collection("se_courses")
      .find({}, { projection: { _id: 1, c_title: 1 } })
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          var ran_dur = {
            dur: Math.floor(Math.random() * 100),
            unit: Math.floor(Math.random() * 1) + 1,
          };
          var myquery = { _id: Number(result[i]._id) };
          var newvalues = {
            $set: {
              c_duration: JSON.stringify(ran_dur),
              c_short_des: sar[Math.floor(Math.random() * sar.length)],
              c_name: result[i].c_title.replace(/\s+/g, "-"),
            },
          };
          dbo
            .collection("se_courses")
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree == 7) {
    dbo
      .collection("se_lessons")
      .find({}, { projection: { _id: 1 } })
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          var ran_dur = {
            dur: Math.floor(Math.random() * 100),
            unit: Math.floor(Math.random() * 3) + 1,
          };
          var myquery = { _id: Number(result[i]._id) };

          let vidararr = [
            "https://media.istockphoto.com/videos/connected-blue-data-network-4k-seamless-loop-video-id1270767960",
            "https://media.istockphoto.com/videos/portrait-of-female-doctor-smiling-and-showing-chroma-key-copy-space-video-id1307545842",
            "https://media.istockphoto.com/videos/asian-young-businesswoman-reporting-a-sales-report-video-id1306636274",
            "https://media.istockphoto.com/videos/portrait-of-indian-man-construction-worker-using-laptop-computer-video-id1307188719",
            "https://media.istockphoto.com/videos/animated-colored-pixel-concept-of-network-background-in-color-pink-video-id1308212767",
            "https://media.istockphoto.com/videos/portrait-young-girl-holding-laptop-lass-using-computer-at-home-six-video-id1307963827",
            "https://media.istockphoto.com/videos/network-animation-business-science-and-technology-video-id1308020662",
            "https://media.istockphoto.com/videos/animated-facebook-live-icon-template-theme-on-green-screen-background-video-id1309046792",
            "https://media.istockphoto.com/videos/female-hands-typing-on-computer-keyboard-sit-at-home-office-desk-video-id1297551049",
            "https://media.istockphoto.com/videos/programming-source-code-abstract-background-video-id1046965704",
            "https://media.istockphoto.com/videos/abstract-program-code-are-written-and-moved-in-the-virtual-space-video-id1256086140",
            "https://media.istockphoto.com/videos/portrait-of-muscular-handsome-businessman-wearing-suit-against-green-video-id1302759734",
          ];
          let vi = vidararr[Math.floor(Math.random() * vidararr.length)];
          var newvalues = {
            $set: {
              duration: JSON.stringify(ran_dur),
              mediaUrl: vi,
            },
          };
          dbo
            .collection("se_lessons")
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
        await res.status(200).json(result);
      });
  } else if (ree == 8) {
    dbo
      .collection("se_lessons")
      .find({})
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        var schemaObj = result[0];
        for (var key in schemaObj) {
          console.log(key, typeof schemaObj[key]);
        }
        res.status(200).json(schemaObj);
      });
  } else if (ree == 11) {
    dbo
      .collection("se_users_meta")
      .find()
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          let ele = result[i].completed;
          ele.quizzes.succes = ele.quizzes.succes.map((a) => Number(a));
          ele.quizzes.fail = ele.quizzes.fail.map((a) => Number(a));
          ele.lessons = ele.lessons.map((a) => Number(a));

          let ciss = result[i].courses;
          for (let cia = 0; cia < ciss.length; cia++) {
            ciss.id = Number(ciss[cia].id);
          }
          var newvalues = {
            $set: {
              completed: ele,
              courses: ciss,
            },
          };
          dbo
            .collection("se_users_meta")
            .updateOne({ ID: result[i].ID }, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
      });

    let ooi = {
      $set: {
        user_message: [
          {
            objet: "",
            readed: 1,
            content: "",
            uri: "",
            id_expe: 0,
            id_desti: 0,
            date_envoi: "",
            date_lecture: "",
          },
        ],
        downloads: [],
        favorites: [],
        visitedcourses: [],
        cart: [],
      },
    };
    dbo
      .collection("se_users_meta")
      .updateMany({ ID: { $gt: 0 } }, ooi, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
    res.status(200).json("ok");
  } else if (ree == 12) {
    dbo
      .collection("se_users")
      .find()
      .toArray(async function (err, result) {
        asser_no_error(err, res);
        for (let i = 0; i < result.length; i++) {
          let ele = result[i].username;
          console.log(ele, result[i].ID);
          var newvalues = {
            $set: {
              display_name: ele,
            },
          };
          dbo
            .collection("se_users")
            .updateOne({ ID: result[i].ID }, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
        }
      });
    res.status(200).json("ok");
  } else if (ree == 13) {
    // compute ttotalcourse in se_category
    var categories = await dbo.collection("se_category").find({}).toArray();
    for (let i = 0; i < categories.length; i++) {
      let element = categories[i];
      const count = await dbo
        .collection("se_courses")
        .countDocuments({ c_category: element.ID });
      dbo
        .collection("se_category")
        .updateOne(
          { ID: categories[i].ID },
          { $set: { totalcourse: count } },
          function (err, res) {
            console.log("1 document updated");
          }
        );
    }
    res.status(200).json("ok");
  } else if (ree == 14) {
    dbo.collection("se_blog_post").updateMany(
      { ID: { $gt: 0 } },
      {
        $set: {
          post_image:
            "https://sedami.com/wp-content/uploads/2019/06/agentie-seo-optimizare-site-scaled.jpg",
        },
      },
      function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      }
    );
    res.status(200).json("ok");
  } else if (ree == 15) {
    // parse courses in user
    var categories = await dbo.collection("se_users_minssi").find({}).toArray();
    for (let i = 0; i < categories.length; i++) {
      let element = categories[i];
      let courses = JSON.parse(element.courses);
      courses = courses.map((mes) => Number(mes));
      dbo
        .collection("se_users_minssi")
        .updateOne({ ID: categories[i].ID }, { $set: { courses } }, function (
          err,
          res
        ) {
          console.log("1 document updated");
        });
    }
    res.status(200).json("ok");
  } else {
    res.status(400).json("forbidden");
  }
};
