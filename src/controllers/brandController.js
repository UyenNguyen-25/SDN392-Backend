const asyncHandler = require("express-async-handler");
const ProductBrand = require("../models/ProductBrand");

exports.getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await ProductBrand.find();
    res.json(brands);
  } catch (error) {
    console.error("Error in getAllBrands:", error);
    res.status(500).json({ message: error.message });
  }
});

exports.createBrand = asyncHandler(async (req, res) => {
  const { brand_name } = req.body;
  try {
    const existingBrand = await ProductBrand.findOne({ brand_name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const newBrand = new ProductBrand({ brand_name });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    console.error("Error in createBrand:", error);
    res.status(500).json({ message: error.message });
  }
});
