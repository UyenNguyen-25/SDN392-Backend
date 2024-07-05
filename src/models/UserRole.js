const mongoose = require("mongoose");

const UserRoleSchema = new mongoose.Schema({
  role_description: {
    type: String,
    require: true,
  },
});

const UserRole = mongoose.model("UserRole", UserRoleSchema);

module.exports = UserRole;
