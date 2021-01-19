const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HistorySchema = new Schema({
  historyType: String,
  inputPath: String,
  outputPath: String,
  totalCount: Number,
  point: Number,
  successCount: Number,
  errorCount: Number,
  createdBy: {
    type: Schema.ObjectId,
    ref: "User",
  },
}, { usePushEach: true, timestamps: true });
mongoose.model("History", HistorySchema);
