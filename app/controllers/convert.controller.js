const mongoose = require("mongoose");
const Upload = mongoose.model("Upload");
const Phone = mongoose.model("Phone");
const bluebird = require("bluebird");
const multer = require("multer");
const path = require("path");
const helper = require("../utils/helper");
const agent = require("../utils/agent");
const fs = require("fs");
const _ = require("lodash");
const { Transform } = require("stream");
const history = require("./history.controller");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    if (path.extname(file.originalname) !== ".txt")
      return cb(new Error("Chỉ chấp nhận định dạng txt"));
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.multer = multer({
  storage: storage,
  limits: {
    fileSize: 3100,
  },
});

async function findPhoneNumbersFromUids(fbUIDs) {
  const matchServerPhoneNumbers = await Phone.find({
    uid: {
      $in: fbUIDs,
    },
  }).lean();
  let matchPhoneNumberMap = _.reduce(
    matchServerPhoneNumbers,
    (result, phone) => {
      result[phone.uid] = phone.phoneNumber;
      return result;
    },
    {}
  );
  await bluebird.map(fbUIDs, (fbUID) => {
    return new Promise((resolve, reject) => {
      if (_.get(matchPhoneNumberMap, fbUID)) {
        return resolve(matchPhoneNumberMap[fbUID]);
      }
      agent
        .get("/" + fbUID, {
          params: {
            fields: "mobile_phone, name, gender",
          },
        })
        .then((res) => {
          const phoneNumber = res.data.mobile_phone;
          const { name, gender } = res.data;
          if (phoneNumber) {
            matchPhoneNumberMap[fbUID] = phoneNumber.replace("+84", "0");
            new Phone({
              phoneNumber,
              uid: fbUID,
              name,
              gender,
            }).save();
          }
          return resolve();
        })
        .catch(() => {
          resolve();
        });
    });
  });
  return matchPhoneNumberMap;
}

async function findUidFromPhones(phones) {
  const matchServerPhoneNumbers = await Phone.find({
    phoneNumber: {
      $in: phones,
    },
  }).lean();
  let matchUidMaps = _.reduce(
    matchServerPhoneNumbers,
    (result, phone) => {
      result[phone.phoneNumber] = phone.uid;
      return result;
    },
    {}
  );
  return matchUidMaps;
}

async function findEmailFromUids(fbUIDs) {
  let matchEmailMap = {};
  await bluebird.map(fbUIDs, (fbUID) => {
    return new Promise((resolve, reject) => {
      agent
        .get("/" + fbUID, {
          params: {
            fields: "email, name, gender",
          },
        })
        .then((res) => {
          const email = _.get(res, "data.email");
          if (email) {
            matchEmailMap[fbUID] = email;
          }
          return resolve();
        })
        .catch(() => {
          resolve();
        });
    });
  });
}

exports.upload = async (req, res) => {
  const { path, originalname } = req.file;
  const { typeUpload } = req.body;
  const result = await new Upload({
    createdBy: helper.getObjectId(req.user),
    typeUpload,
    filePath: path,
    fileName: originalname,
  }).save();
  res.jsonp(result);
};

exports.convertFileUidsToPhone = async (req, res) => {
  const user = req.user;
  const fileUploadId = req.body.fileId;
  const fileUpload = await Upload.findById(helper.getObjectId(fileUploadId));
  if (!fileUploadId) throw new Error("Ko tìm thấy file yêu cầu. ");
  let convertIds = {};
  let totalFbId = 0;
  const convertToPhoneNumber = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      const fbUIDs = chunk.trim().split("\n");
      totalFbId += fbUIDs.length;
      findPhoneNumbersFromUids(fbUIDs)
        .catch(() => {})
        .then((matchPhoneNumberMap) => {
          _.assign(convertIds, matchPhoneNumberMap);
        })
        .finally(() => {
          callback();
        });
    },
  });

  const streamReadFile = fs
    .createReadStream(fileUpload.filePath, {
      encoding: "utf-8",
    })
    .pipe(convertToPhoneNumber);

  streamReadFile.on("end", () => {
    res.jsonp(convertIds);
  });
  streamReadFile.on("finish", async () => {
    const convertedIdsString = _.reduce(
      convertIds,
      (result, phone, uid) => {
        result += `${uid}\t${phone.replace("+84", "0")}\n`;
        return result;
      },
      ""
    );
    const successCount = _.size(convertIds);
    const point = minusPoint(user, successCount);

    const historyResult = await history.saveHistory({
      historyType: "convert-uid-to-phone",
      input: {
        type: "path",
        value: fileUpload.filePath,
      },
      output: {
        type: "string",
        value: convertedIdsString,
      },
      point,
      totalCount: totalFbId,
      successCount,
      errorCount: totalFbId - successCount,
      createdBy: helper.getObjectId(req.user),
    });

    res.jsonp({
      total: totalFbId,
      success: successCount,
      point,
      history: helper.getObjectId(historyResult),
      result: convertIds,
    });
  });
};

exports.convertUidsToPhone = async (req, res) => {
  const user = req.user;
  const { uids } = req.body;
  const convertIds = await findPhoneNumbersFromUids(uids);
  const totalFbId = uids.length;
  const convertedIdsString = _.reduce(
    convertIds,
    (result, phone, uid) => {
      result += `${uid}\t${phone.replace("+84", "0")}\n`;
      return result;
    },
    ""
  );
  const successCount = _.size(convertIds);
  const point = minusPoint(user, successCount);
  const historyResult = await history.saveHistory({
    historyType: "convert-uid-to-phone",
    input: {
      type: "string",
      value: uids.join("\n"),
    },
    output: {
      type: "string",
      value: convertedIdsString,
    },
    point: point,
    totalCount: totalFbId,
    successCount,
    errorCount: totalFbId - successCount,
    createdBy: helper.getObjectId(req.user),
  });

  res.jsonp({
    total: totalFbId,
    success: successCount,
    history: helper.getObjectId(historyResult),
    result: convertIds,
  });
};

exports.convertFilePhonesToUid = async (req, res) => {
  const user = req.user;
  const fileUploadId = req.body.fileId;
  const fileUpload = await Upload.findById(helper.getObjectId(fileUploadId));
  if (!fileUploadId) throw new Error("Ko tìm thấy file yêu cầu. ");
  let convertedPhones = {};
  let totalFbId = 0;
  const convertToUIds = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      const phones = chunk.trim().split("\n");
      totalFbId += phones.length;
      findUidFromPhones(phones)
        .catch((err) => {})
        .then((data) => {
          _.assign(convertedPhones, data);
        })
        .finally(() => {
          callback();
        });
    },
  });

  const streamReadFile = fs
    .createReadStream(fileUpload.filePath, {
      encoding: "utf-8",
    })
    .pipe(convertToUIds);

  streamReadFile.on("end", () => {
    res.jsonp(convertedPhones);
  });
  streamReadFile.on("finish", async () => {
    const convertedIdsString = _.reduce(
      convertedPhones,
      (result, phone, uid) => {
        result += `${uid}\t${phone.replace("+84", "0")}\n`;
        return result;
      },
      ""
    );
    const successCount = _.size(convertedPhones);
    const point = minusPoint(user, successCount);

    const historyResult = await history.saveHistory({
      historyType: "convert-phone-to-uid",
      input: {
        type: "path",
        value: fileUpload.filePath,
      },
      output: {
        type: "string",
        value: convertedIdsString,
      },
      point,
      totalCount: totalFbId,
      successCount,
      errorCount: totalFbId - successCount,
      createdBy: helper.getObjectId(req.user),
    });

    res.jsonp({
      total: totalFbId,
      success: successCount,
      point,
      history: helper.getObjectId(historyResult),
      result: convertedPhones,
    });
  });
};

exports.convertPhoneToUid = async (req, res) => {
  const user = req.user;
  const { phones } = req.body;
  const convertedPhones = await findUidFromPhones(phones);
  const totalPhone = phones.length;
  const convertedIdsString = _.reduce(
    convertedPhones,
    (result, phone, uid) => {
      result += `${phone.replace("+84", "0")}\t${uid}\n`;
      return result;
    },
    ""
  );
  const successCount = _.size(convertedPhones);
  const point = minusPoint(user, successCount);
  const historyResult = await history.saveHistory({
    historyType: "convert-phone-to-uid",
    input: {
      type: "string",
      value: phones.join("\n"),
    },
    output: {
      type: "string",
      value: convertedIdsString,
    },
    point: point,
    totalCount: totalPhone,
    successCount,
    errorCount: totalPhone - successCount,
    createdBy: helper.getObjectId(req.user),
  });

  res.jsonp({
    total: totalPhone,
    success: successCount,
    history: helper.getObjectId(historyResult),
    result: convertedPhones,
  });
};

exports.convertFileUidsToEmails = async (req, res) => {
  const user = req.user;
  const fileUploadId = req.body.fileId;
  const fileUpload = await Upload.findById(helper.getObjectId(fileUploadId));
  if (!fileUploadId) throw new Error("Ko tìm thấy file yêu cầu. ");
  let convertedEmails = {};
  let totalFbId = 0;
  const convertToEmail = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      const uids = chunk.trim().split("\n");
      totalFbId += uids.length;
      findEmailFromUids(uids)
        .catch((err) => {})
        .then((data) => {
          _.assign(convertedEmails, data);
        })
        .finally(() => {
          callback();
        });
    },
  });

  const streamReadFile = fs
    .createReadStream(fileUpload.filePath, {
      encoding: "utf-8",
    })
    .pipe(convertToEmail);

  streamReadFile.on("end", () => {
    res.jsonp(convertedEmails);
  });
  streamReadFile.on("finish", async () => {
    const convertedIdsString = _.reduce(
      convertedEmails,
      (result, email, uid) => {
        result += `${uid}\t${email}\n`;
        return result;
      },
      ""
    );
    const successCount = _.size(convertedEmails);
    const point = minusPoint(user, successCount);

    const historyResult = await history.saveHistory({
      historyType: "convert-uid-to-mail",
      input: {
        type: "path",
        value: fileUpload.filePath,
      },
      output: {
        type: "string",
        value: convertedIdsString,
      },
      point,
      totalCount: totalFbId,
      successCount,
      errorCount: totalFbId - successCount,
      createdBy: helper.getObjectId(req.user),
    });

    res.jsonp({
      total: totalFbId,
      success: successCount,
      point,
      history: helper.getObjectId(historyResult),
      result: convertedEmails,
    });
  });
};

exports.convertUidsToEmail = async (req, res) => {
  const user = req.user;
  const { uids } = req.body;
  const convertedEmails = await findEmailFromUids(uids);
  const totalFbId = uids.length;
  const convertedIdsString = _.reduce(
    convertedEmails,
    (result, email, uid) => {
      result += `${uid}\t${email}\n`;
      return result;
    },
    ""
  );
  const successCount = _.size(convertedEmails);
  const point = minusPoint(user, successCount);
  const historyResult = await history.saveHistory({
    historyType: "convert-uid-to-email",
    input: {
      type: "string",
      value: uids.join("\n"),
    },
    output: {
      type: "string",
      value: convertedIdsString,
    },
    point: point,
    totalCount: totalFbId,
    successCount,
    errorCount: totalFbId - successCount,
    createdBy: helper.getObjectId(req.user),
  });

  res.jsonp({
    total: totalFbId,
    success: successCount,
    history: helper.getObjectId(historyResult),
    result: convertedEmails,
  });
};

exports.getPhoneFromUid = async (req, res) => {
  const { uid } = req.query;
  if (!uid) throw new Error("Vui lòng điền UID");
  const result = await findPhoneNumbersFromUids([uid]);
  res.jsonp(result);
};

function minusPoint(user, point) {
  if (_.map(user.roles, "name").includes("premium")) return 0;
  user.point -= point;
  user.save();
  return point;
}
