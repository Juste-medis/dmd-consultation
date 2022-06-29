const expressJwt = require("express-jwt");
const config = require("../config/config.json");
const userService = require("../Services/users.service");
module.exports = jwt;
function jwt() {
  const secret = config.secret;
  return expressJwt({ secret, algorithms: ["HS256"], isRevoked }).unless({
    path: [
      "/api/adversi",
      "/api/category",
      /^\/api\/category\/.*/,
      "/api/adversi",
      "/api/userapreciation",
      "/api/test",
      /^\/api\/test\/.*/,
      "/api/features",
      "/api/course",
      /^\/api\/course\/.*/,
      "/api/formator",
      /^\/api\/formator\/.*/,
      "/api/comment",
      /^\/api\/comment\/.*/,
      "/auth/users",
      /^\/auth\/users\/.*/,
    ],
  });
}
async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);
  if (!user) {
    return done(null, true);
  }
  done();
}
