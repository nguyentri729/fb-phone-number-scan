const history = require("../controllers/history.controller");
const user = require("../controllers/user.controller");
const { asyncMiddleware } = require("../utils/helper");

module.exports = (app) => {
  app.route("/history/").get(user.requireLogin, asyncMiddleware(history.list));
  app.route("/history/:historyById/download").get(asyncMiddleware(history.downloadHistory))
  app.param("historyById", history.historyById);
};
