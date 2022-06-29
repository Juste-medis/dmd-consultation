/**
 *mise a jour : offer status
 */
exports.updateOfferStatus = async function (courseid) {
  let today = new Date(Date.now()).toISOString();
  let toActivate = await global.dbo
    .collection("dmd_offers")
    .find({
      offer_status: "programmé",
      offer_startDate: { $lt: today },
      offer_endDate: { $gte: today },
    })
    .toArray();
  /*
  let todesActivate = await global.dbo
    .collection("dmd_offers")
    .find({
      offer_status: "active",
      offer_endDate: { $lt: today },
    })
    .toArray();
*/
  for (let oi = 0; oi < toActivate.length; oi++) {
    await global.dbo
      .collection("dmd_offers")
      .updateOne(
        { ID: toActivate[oi].ID },
        { $set: { offer_status: "active" } },
        function (err, res) {
          if (err) throw err;
        }
      );
    if (
      !["review", "rejected", "blocked"].includes(toActivate[oi].meta_status)
    ) {
      global.dbo
        .collection("dmd_offers")
        .updateOne(
          { ID: toActivate[oi].ID },
          { $set: { meta_status: "active" } },
          function (err, res) {
            if (err) throw err;
          }
        );
    }
  } /*
  for (let oi = 0; oi < todesActivate.length; oi++) {
    await global.dbo.collection("dmd_offers").updateOne(
      {
        ID: todesActivate[oi].ID,
      },
      { $set: { meta_status: "inactive" } },
      function (err, res) {
        if (err) throw err;
      }
    );
    if (
      !["review", "rejected", "blocked"].includes(todesActivate[oi].meta_status)
    ) {
      global.dbo.collection("dmd_offers").updateOne(
        {
          ID: todesActivate[oi].ID,
        },
        { $set: { meta_status: "inactive" } },
        function (err, res) {
          if (err) throw err;
        }
      );
    }
  }*/
  return 1;
};
/**
 *mise a jour : user_minssi.courses(addand remove)
 */
exports.UpdateMinssiCourse = async function (userID, courseid) {
  let courses = await global.dbo
    .collection("se_users_minssi")
    .findOne({ ID: userID }, { projection: { courses: 1 } });
  if (courses) {
    courses = courses.courses;
    const itemIndex = courses.find((item) => item === courseid);
    if (itemIndex) {
      courses = courses.filter((item) => item !== itemIndex);
    } else {
      courses.push(courseid);
    }
    global.dbo.collection("se_users_minssi").updateOne(
      { ID: userID },
      {
        $set: {
          courses,
        },
      },
      function (err, res) {
        if (err) throw err;
      }
    );
  }
  return 1;
};
/**
 *mise a jour : compute ttotalcourse in se_category
 */
exports.UpdateNumberOfCourse = async function () {
  // compute ttotalcourse in se_category
  var categories = await global.dbo
    .collection("se_category")
    .find({})
    .toArray();
  for (let i = 0; i < categories.length; i++) {
    let element = categories[i];
    const count = await global.dbo
      .collection("se_courses")
      .countDocuments({ c_category: element.ID });
    global.dbo
      .collection("se_category")
      .updateOne({ ID: categories[i].ID }, { $set: { totalcourse: count } });
  }
  return 1;
};
