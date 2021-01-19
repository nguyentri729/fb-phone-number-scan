const mongoose = require("mongoose");
const Token = mongoose.model("Token");
const axios = require("axios");
const _ = require("lodash");
const helper = require("../utils/helper");
const bluebird = require("bluebird");
const config = require("../config");

exports.add = async (req, res) => {
  const tokens = req.body.tokens.split("\n");
  const infoTokens = await bluebird.map(tokens, (token) => {
    return axios
      .get("https://graph.facebook.com/me?access_token=" + token.trim())
      .then((res) => {
        const { name, id } = res.data;
        return {
          uid: id,
          name: name,
          accessToken: token,
        };
      })
      .catch(_.constant(null));
  });
  const duplicateToken = await Token.find({
    uid: _.map(infoTokens, "uid"),
  }).exec();
  if (duplicateToken.length > 0) {
    res.jsonp({ err: true });
  } else {
    const result = await Token.insertMany(_.compact(infoTokens));
    res.jsonp(result);
  }
};

exports.checkLive = async (req, res) => {
  const tokens = await Token.find({ status: "live" }).lean();
  const deadTokens = _.compact(
    await bluebird.map(tokens, (token) => {
      return axios
        .get("https://graph.facebook.com/me", {
          params: {
            access_token: token.accessToken,
          },
        })
        .then(_.constant(null))
        .catch(() => {
          return token;
        });
    })
  );
  if (_.get(deadTokens, "length", 0) > 0) {
    // remove dead token
    const result = await Token.updateMany(
      {
        _id: _.map(deadTokens, helper.getObjectId),
      },
      {
        status: "die",
      }
    ).exec();
    res.jsonp(result);
  } else {
    res.jsonp("Yeah ! Not found dead token :)) ");
  }
};

exports.list = async (req, res) => {
  const user = req.user;
  if (_.map(user.roles, "name").includes("admin")) {
    const tokens = await Token.find({
      status: "live",
    }).lean();
    res.jsonp(tokens);
  } else {
    throw new Error("Chỉ có admin mới có thể xem token @_@ so sad :))) ");
  }
};

exports.useSystemToken = async function (req, res) {
  const FB_API = "https://graph.facebook.com";
  const { version, idPost, path } = req.params;
  const avaiablePath = ["reactions", "comments", "shareposts"];
  if (!avaiablePath.includes(path) && !parseInt(idPost))
    throw new Error("Không hỗ trợ phương thức này ");
  const { pretty, limit, before, after, fields } = req.query;
  let accessToken = "";
  let TokenQuery = Token.findOne();
  TokenQuery.where({
    status: "live",
  });

  if (_.get(req, "query.access_token")) {
    Token.where({
      _id: helper.getObjectId(req.query.access_token),
    });
  }
  const token = await TokenQuery;
  if (!token) throw new Error("Token không hơp lệ");
  accessToken = token.accessToken;
  const result = await axios
    .get(`${FB_API}/${version}/${idPost}/${path || ""}`, {
      params: {
        access_token: accessToken,
        pretty,
        limit,
        fields,
        before,
        after,
      },
    })
    .then((response) => response.data);
  const txtData = JSON.stringify(result)
    .replace(new RegExp(token.accessToken, "g"), token._id.toString())
    .replace(new RegExp(FB_API, "g"), config.baseURL + "/useSystemToken");
  res.jsonp(JSON.parse(txtData));
};
