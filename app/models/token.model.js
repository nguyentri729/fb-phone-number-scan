const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TokenSchema = new Schema(
  {
    uid: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["live", "die"],
      default: "live",
    },
  },
  { usePushEach: true, timestamps: true }
);

mongoose.model("Token", TokenSchema);
