const passport = require("passport");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("../config");
require("../configs/strategies/jwt");
const _ = require("lodash")
const User = mongoose.model("User");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Vui lòng điền đầy đủ email hoặc mật khẩu.");
  }

  const user = await User.findOne({ email }).exec();

  if (user && user.authenticate(password)) {
    const { _id, fullName, roles } = user;
    const accessToken = jwt.sign(
      {
        _id,
        email,
        fullName,
        roles,
      },
      config.jwtSecret,
      { expiresIn: "2d" }
    );

    const refreshToken = jwt.sign(
      {
        _id,
      },
      config.jwtSecret,
      { expiresIn: "10d" }
    );
    return res.jsonp({
      accessToken,
      refreshToken,
      expiresIn: "2h",
      tokenType: "bearer",
    });
  }

  res.status(301).jsonp({
    error: true,
    msg: "The username or password is incorrect !!!",
  });
};

exports.register = async (req, res) => {
  const { email, password, fullName } = req.body;
  const sameEmailUser = await User.find({
    email,
  }).exec();
  if (sameEmailUser) {
    throw new Error("Email này đã được đăng ký. ");
  }

  await new User({
    email,
    password,
    fullName,
    roles: [
      {
        name: "normal",
      },
    ],
  }).save();
  res.jsonp({
    status: "success",
    msg: "Tài khoản đã được tạo thành công !",
  });
};

exports.requireLogin = passport.authenticate("jwt", { session: false });

exports.getUserInfo = (req, res) => {
  const { email, fullName, roles, status, point } = req.user;
  res.jsonp({
    email,
    fullName,
    roles: _.map(roles, 'name'),
    point,
    status,
  });
};


