const _ = require("lodash");
const glob = require("glob");
module.exports = _.assignIn(
  require("./configs/env/all"),
  require("./configs/env/" + process.env.NODE_ENV) || {}
);
module.exports.getGlobbedFiles = function (globPatterns, removeRoot) {
  // For context switching
  const _this = this;

  // URL paths regex
  const urlRegex = new RegExp("^(?:[a-z]+:)?//", "i");

  // The output array
  let output = [];

  // If glob pattern is array so we use each
  // pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (removeRoot) {
        files = files.map(function (file) {
          return file.replace(removeRoot, "");
        });
      }

      output = _.union(output, files);
    }
  }

  return output;
};
