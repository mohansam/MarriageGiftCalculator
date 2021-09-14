const mongoose = require("mongoose");

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

module.exports = mongoose.model("user", UserSchema);
