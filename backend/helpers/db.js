const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const username = "djondo",
  pass = "djondo_54hyqsYF22DX569854hyqsYF22DX569854hyqsYF22DX5698",
  host = "127.0.0.1:27017",
  db = "dmd_base",
  url = `mongodb://${username}:${pass}@${host}/${db}`,
  connecOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authMechanism: "SCRAM-SHA-1",
    authSource: "admin",
  };

function incrementor(req, res, next) {
  MongoClient.connect(url, connecOption, function (err, db) {
    assert.strictEqual(null, err);
    global.dbo = db.db("dmd_base");
    global.dblog = db.db("dmd_logs");
    attachlogger();
    next();
  });
}
function attachlogger() {
  global.logger = createLogger({
    transports: [
      new transports.File({
        filename: "logs/server.log",
        format: format.combine(
          format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
          format.align(),
          format.printf(
            (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
          )
        ),
      }),
      new transports.MongoDB({
        level: "error",
        db: `mongodb://${username}:${pass}@${host}/logs`,
        options: connecOption,
        collection: "server_logs",
        format: format.combine(format.timestamp(), format.json()),
      }),
    ],
  });
}
module.exports = incrementor;
