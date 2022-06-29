async function incrementor(cole, index = "ID") {
  let pro = {},
    obj;
  pro[index] = -1;
  async function getResults() {
    return await global.dbo
      .collection(cole)
      .find({})
      .sort(pro)
      .limit(1)
      .toArray();
  }
  const results = await getResults();

  if (results[0]) {
    let re = results[0][index];
    obj = results.length > 0 ? re : 1;
    return obj || 1;
  } else {
    return 1;
  }
}
module.exports = incrementor;
