const convert = require("../controllers/convert.controller");
const { asyncMiddleware } = require("../utils/helper");
const user = require("../controllers/user.controller");
module.exports = (app) => {
  app
    .route("/convert/upload")
    .post(
      user.requireLogin,
      asyncMiddleware(convert.multer.single("file")),
      asyncMiddleware(convert.upload)
    );
  app
    .route("/convert/file-uids-to-phone")
    .post(user.requireLogin, asyncMiddleware(convert.convertFileUidsToPhone));
  app
    .route("/convert/uids-to-phone")
    .post(user.requireLogin, asyncMiddleware(convert.convertUidsToPhone));

  app
    .route("/convert/file-phones-to-uids")
    .post(user.requireLogin, asyncMiddleware(convert.convertFilePhonesToUid));

    app
    .route("/convert/phones-to-uids")
    .post(user.requireLogin, asyncMiddleware(convert.convertPhoneToUid));


    app
    .route("/convert/file-uids-to-emails")
    .post(user.requireLogin, asyncMiddleware(convert.convertFileUidsToEmails));


    app
    .route("/convert/uids-to-emails")
    .post(user.requireLogin, asyncMiddleware(convert.convertUidsToEmail));

    app.route("/convert/get-phone-from-uid").get(asyncMiddleware(convert.getPhoneFromUid))

};
