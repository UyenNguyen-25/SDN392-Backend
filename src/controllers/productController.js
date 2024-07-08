const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const ProductStatus = require("../models/ProductStatus");

const autoCreateStatus = asyncHandler(async (req, res) => {
  try {
    const statuses = ["inStock", "outStock", "promotion"];

    for (const item of statuses) {
      const existingStatus = await ProductStatus.findOne({
        product_status_description: item,
      });
      if (!existingStatus) {
        await ProductStatus.create({
          product_status_description: item,
        });
      }
    }

    res.status(200).json("Auto create product status successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error.");
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const { product_id } = req.params;

  try {
    const product = await Product.findById(product_id)
      .populate("product_status")
      .populate("product_brand_id");

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProductStatus = asyncHandler(async (req, res) => {
  try {
    const productStatuses = await ProductStatus.find();

    res.json(productStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error.");
  }
});

module.exports = { autoCreateStatus, getProductById, getProductStatus };
