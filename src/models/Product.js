const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    product_brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductBrand",
      required: true,
    },    
    product_name: {
      type: String,
      maxlength: 200,
    },
    product_type: {
      type: String,
      maxlength: 50,
    },
    product_age: {
      type: String,
      maxlength: 10,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_price_discount: {
      type: Number,
    },
    product_img: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductStatus",
      required: true,
    },
    feedback_id: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
      default: null
    }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
