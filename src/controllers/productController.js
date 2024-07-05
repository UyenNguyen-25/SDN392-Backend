const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const ProductStatus = require("../models/ProductStatus");
const ProductBrand = require("../models/ProductBrand");

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

module.exports = {autoCreateStatus}