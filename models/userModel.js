const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: [true],
    },
    UserEmail: {
      type: String,
      required: [true],
      unique: true,
      lowercase: true,
    },
    UserPwd: {
      minlength: 6,
      type: String,
      required: [true],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.UserPwd = await bcrypt.hash(this.UserPwd, salt);
  next();
});

// static method to login user
UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ UserEmail: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.UserPwd);
    if (auth) {
      return user;
    }
    err = JSON.stringify({
      type: "m",
      errors: [{ msg: "incorrect password" }],
    });
    throw Error(err);
  }
  err = JSON.stringify({ type: "m", errors: [{ msg: "incorrect email" }] });
  throw Error(err);
};
module.exports = mongoose.model("user", UserSchema);
