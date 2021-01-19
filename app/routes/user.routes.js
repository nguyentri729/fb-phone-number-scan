const userController = require("../controllers/user.controller");
const { asyncMiddleware } = require("../utils/helper");
module.exports = (app) => {
  app
    .route("/me")
    .get(
      userController.requireLogin,
      asyncMiddleware(userController.getUserInfo)
    );

  app.route("/register").post(asyncMiddleware(userController.register));
  app.route("/login").post(asyncMiddleware(userController.login));
};
