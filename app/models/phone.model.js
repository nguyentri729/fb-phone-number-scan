const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PhoneSchema = new Schema({
  uid: {
    type: String,
    unique: true,
    index: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    index: true,
  },
  name: String, 
  gender: String
});
mongoose.model("Phone", PhoneSchema);
