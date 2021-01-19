const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const config = require("../../config");
const helper = require("../../utils/helper");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

module.exports = passport.use(
  new JwtStrategy(opts, function (jwtPayload, done) {
    User.findById(helper.getObjectId(jwtPayload), (err, user) => {
      if (err) return done(err, false);
      if (user) return done(null, user);
      return done(null, false);
    });
  })
);
