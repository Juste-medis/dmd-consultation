const assert = require("assert");
module.exports = async (req, res, next) => {
  let userId = Number(req.params.userId);
  try {
    if (userId) {
      //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
      const hasWrite = await require("../helpers/dbUtils").isActive(userId);
      assert(hasWrite, "Not admin");
      //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
      next();
    } else {
      res.status(200).json({
        error: "Unauthorized by Enabled",
      });
    }
  } catch (error) {
    res.status(200).json({
      error: "Unauthorized by Enabled",
    });
  }
};
