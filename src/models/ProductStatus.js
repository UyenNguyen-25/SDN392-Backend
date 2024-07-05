const mongoose = require("mongoose");

const ProductStatusSchema = new mongoose.Schema(
  {
    product_status_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductStatus = mongoose.model("ProductStatus", ProductStatusSchema);

module.exports = ProductStatus;
