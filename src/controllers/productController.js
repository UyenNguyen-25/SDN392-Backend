const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const ProductStatus = require("../models/ProductStatus");
const ProductBrand = require("../models/ProductBrand");
const Feedback = require('../models/Feedback');
const autoCreateStatus = asyncHandler(
    async (req, res) => {
      try {
        const statuses = ["inStock", "outStock", "promotion"];
  
        for (const item of statuses) {
          await ProductStatus.create({
            product_status_description: item,
          });
        }
  
        res.status(200).json("auto create product status successfully");
      } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error.");
      }
    }
  );
  const get_all_product = async (req, res) => {
    try {
      const products = await Product.find()
        .populate('product_brand_id', 'brand_name')
        .populate('product_status', 'product_status_description')
        .populate('feedback_id', 'feedback_rating feedback_description');
  
      if (!products.length) {
        return res.status(400).json({ message: "No products found" });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
module.exports = {autoCreateStatus , get_all_product}