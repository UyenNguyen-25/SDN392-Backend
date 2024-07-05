const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_fullname: {
      type: String,
      default: "Ba, mẹ",
    },
    user_password: {
      type: String,
      minLength: 6,
      require: true,
    },
    user_email: {
      type: String,
    },
    user_phoneNumber: {
      type: String,
      require: true,
    },
    user_role: {
      type: mongoose.Types.ObjectId,
      ref: "UserRole",
      default: "6687c30d65384dddd7791ae4",
    },
    address_id: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "UserAddress",
    },
    user_status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
