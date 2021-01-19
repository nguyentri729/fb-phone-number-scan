const _ = require("lodash");
const logger = require("../configs/logger");
// const agent = require("./agent")
const axios = require("axios")
const ObjectId = require("mongoose").Types.ObjectId;
exports.getObjectId = function (obj) {
  const id = _.get(obj, "_id") || obj;
  if (_.isString(id) && ObjectId.isValid(id)) return new ObjectId(id);
  return id;
};

exports.asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error(err.message);
    res.status(400).jsonp({
      error: true,
      msg: _.get(err, "message"),
    });
  });
};

exports.getInfoToken = async (token, callback) => {
  const { data } = await axios.get(
    "https://graph.facebook.com/me?access_token=" + token
  );
  if (data) {
    if (callback) callback(data);
    return data;
  }
  callback(err)
  return false;
};


