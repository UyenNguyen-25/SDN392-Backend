const mongoose = require("mongoose");

const UserAddressSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    address_line1: {
      type: String,
      require: true,
      default: "",
    },
    address_line2: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const UserAddress = mongoose.model("UserAddress", UserAddressSchema);

module.exports = UserAddress;
