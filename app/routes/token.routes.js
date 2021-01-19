const token = require("../controllers/token.controller");
const user = require("../controllers/user.controller");
const { asyncMiddleware } = require("../utils/helper");
module.exports = (app) => {
  app.route("/token/add").post(token.add);
  app.route("/token/check").get(token.checkLive);
  app.get("/useSystemToken/:version/:idPost/:path", user.requireLogin, asyncMiddleware(token.useSystemToken))
  app.get("/useSystemToken/:version/:idPost", user.requireLogin, asyncMiddleware(token.useSystemToken))

  app
    .route("/tokens")
    .get(user.requireLogin, asyncMiddleware(token.list));
};
