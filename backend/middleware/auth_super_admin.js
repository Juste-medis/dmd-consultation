const assert = require("assert");
module.exports = async (req, res, next) => {
  let userId = req.params.userId;
  try {
    if (userId) {
      //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
      const hasWrite = await require("../helpers/dbUtils").isSuperAdmin(userId);
      assert(hasWrite, "Not admin");
      //<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
      next();
    } else {
      res.status(200).json({
        message:
          "Vous n'avez pas l'autorisation pour effectuer cette oppération",
      });
    }
  } catch (error) {
    res.status(200).json({
      message: "Vous n'avez pas l'autorisation pour effectuer cette oppération",
    });
  }
};
