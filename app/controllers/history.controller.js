const mongoose = require("mongoose");
const History = mongoose.model("History");
const fs = require("fs");
const _ = require("lodash");
const helper = require("../utils/helper");
/* 
    @historyType: ["convert-uid-to-phone", "convert-phone-to-uid"],
    @input, output: {type: ["path", "string"],  value: ""}
    @createdBy: ObjectId
*/
function saveThenGetPath(input) {
  if (input.type === "path") return input.value;
  const randomPath = "./uploads/history/" + Math.random().toString(36).slice(2) + ".txt";
  fs.writeFileSync(randomPath, input.value);
  return randomPath;
}

exports.saveHistory = ({
  historyType,
  input,
  output,
  totalCount,
  point,
  successCount,
  errorCount,
  createdBy,
}) => {
  console.log({point})
  let inputPath = saveThenGetPath(input);
  let outputPath = saveThenGetPath(output);
  return new History({
    historyType,
    inputPath,
    outputPath,
    totalCount,
    successCount,
    point,
    errorCount,
    createdBy,
  }).save();
};

exports.list = async (req, res) => {
  const result = await History.find({
    createdBy: helper.getObjectId(req.user),
  }).sort("-createdAt");
  res.jsonp(result);
};

exports.downloadHistory = async (req, res) => {
  const history  = req.history
  const type = _.get(req, "query.type", "input") 
  const path = type === "input" ? history.inputPath : history.outputPath
  res.download(path)
};

exports.historyById = async (req, res, next, id) => {
  History.findById(id).exec(function (err, history) {
    if (err) return next(err);
    if (!history) return next(new Error("Failed to load history " + id));
    req.history = history;
    next();
  });
};
