const mongoose = require("mongoose");

const ProductBrandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductBrand = mongoose.model("ProductBrand", ProductBrandSchema);

module.exports = ProductBrand;
