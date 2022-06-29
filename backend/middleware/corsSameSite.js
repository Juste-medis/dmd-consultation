var cors = require("cors");
module.exports = cors({
  origin: function (origin, callback) {
    let orarr = ["https://141.94.16.251"];
    if (global.localmachine) {
      orarr.push("https://192.168.1.119:3000");
      orarr.push("https://localhost:3000");
      orarr.push("https://192.168.142.187:3000");
    }
    if (!origin) return callback(null, true);
    if (orarr.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(origin + " Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
