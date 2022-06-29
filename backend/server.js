//pour globaliser la connaissance de la machine executrice
global.localmachine = process.cwd().includes("/home/juste10");

const https = require("https"),
  http = require("http"),
  { normalizePort, errorHandler } = require("./config/init"),
  fs = require("fs"),
  app = require("./app"),
  appn = require("./appn");

let opkey,
  opcert,
  port,
  portn = normalizePort(process.env.PORT || "80");

opkey = "ssl/private.key";
opcert = "ssl/certificate.crt";

if (global.localmachine) {
  /*
  opkey = "ssl/private.key";
  opcert = "ssl/certificate.crt";
  */
  port = normalizePort(process.env.PORT || "2857");
} else {
  /*
  opkey = "/etc/letsencrypt/live/sedami.com/privkey.pem";
  opcert = "/etc/letsencrypt/live/sedami.com/fullchain.pem";
  */
  port = normalizePort(process.env.PORT || 443);
}

const options = {
  key: fs.readFileSync(opkey),
  cert: fs.readFileSync(opcert),
};

app.set("port", port);
appn.set("port", portn);
const server = https.createServer(options),
  servern = http.createServer(options);

server.on("request", app);
servern.on("request", appn);

server.on("error", (e) => errorHandler(e, server, port));
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
const terminate = require("./config/terminate"),
  exitHandler = terminate(server, {
    coredump: false,
    timeout: 500,
  });
process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
process.on("SIGTERM", exitHandler(0, "SIGTERM"));
process.on("SIGINT", exitHandler(0, "SIGINT"));

//servern.listen(portn, "0.0.0.0");
server.listen(port, "0.0.0.0");
