const reaction = require("../../controllers/auto/reaction.controller");
const user = require("../../controllers/user.controller");
module.exports = (app) => {
  app.route("/auto-reaction").get(user.requireLogin, reaction.list);

  app.route("/auto-reaction/create").post(user.requireLogin, reaction.create);

  app
    .route("/auto-reaction/:reactorById/")
    .get(user.requireLogin, reaction.read);

  app
    .route("/auto-reaction/:reactorById/stop")
    .put(user.requireLogin, reaction.stop);

  app
    .route("/auto-reaction/:reactorById/active")
    .put(user.requireLogin, reaction.active);

  app
    .route("/auto-reaction/:reactorById/update")
    .put(user.requireLogin, reaction.update);

  app.param("reactorById", reaction.reactorById);
};
