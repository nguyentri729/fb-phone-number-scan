const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoReactionSchema = new Schema({
  accessToken: {
    type: String, 
    required: true
  },
  facebookID: {
    type: String, 
    required: true
  },
  name: String,
  typeReaction: {
      type: String, 
      enum: ["random", "like", "love", "haha", "sad", "angry"],
      default: "random"
  },
  option: {
    type: String,
    enum: ["all", "only_friend", "only_page"],
    default: "all"
  },
  logs: [{
      postId: String,
      status: String, 
      createdAt: Date
  }],
  status: {
      status: String, 
      note: String
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: "User",
  },
});
mongoose.model("AutoReaction", AutoReactionSchema);
