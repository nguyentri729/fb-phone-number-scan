const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UploadFile = new Schema(
  {
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
    },
    typeUpload: {
      type: String,
      // enum: ["convert-uid-to-phone", "convert-phone-to-uid"],
    },
    filePath: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  { usePushEach: true, timestamps: true }
);

mongoose.model("Upload", UploadFile);
