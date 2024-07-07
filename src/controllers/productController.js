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

const createNewProduct = asyncHandler(
  async (req, res) => {
    try {
      const dataCreate = req.body;
      const duplicate_product_name = await Product.findOne({ product_name: dataCreate.product_name });
      if (duplicate_product_name) {
        return res.status(400).json({ message: "Product name already exists." });
      }
      const productBrand = await ProductBrand.findOne({ _id: dataCreate.product_brand_id });
      if (!productBrand) {
        return res.status(400).json({ message: "No product brand found." });
      }
      const productStatus = await ProductStatus.findOne({ _id: dataCreate.product_status });
      if (!productStatus) {
        return res.status(400).json({ message: "No product status id found." });
      }

      const newProduct = await Product.create({
        product_name: dataCreate.product_name,
        product_type: dataCreate.product_type,
        product_brand_id: dataCreate.product_brand_id,
        product_age: dataCreate.product_age,
        product_price: dataCreate.product_price,
        product_price_discount: dataCreate.product_price_discount,
        product_img: dataCreate.product_img,
        quantity: dataCreate.quantity,
        product_description: dataCreate.product_description,
        product_status: dataCreate.product_status,
      });
      newProduct.save();
      res.status(200).json({ message: "Create product successfully", data: newProduct });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "No product status found." });
    }
  }
);

const duplicate_product_name = asyncHandler(
  async (req, res) => {
    try {
      const { product_name } = req.body;
      const product = await Product.findOne({ product_name });
      if (!product) {
        return res.status(200).json({ message: "Product name is available." });
      }
      res.status(400).json({ message: "Product name already exists." });
    } catch {
      res.status(500).json({ message: "Internal server error." });
    }
  }
)

const update_product = asyncHandler(
  async (req, res) => {
    try {
      const { product_id } = req.params;
      const dataUpdate = req.body;
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(400).json({ message: "No product found." });
      }
      const productBrand = await ProductBrand.findOne({ _id: dataUpdate.product_brand_id });
      if (!productBrand) {
        return res.status(400).json({ message: "No product brand found." });
      }
      const productStatus = await ProductStatus.findOne({ _id: dataUpdate.product_status });
      if (!productStatus) {
        return res.status(400).json({ message: "No product status found." });
      }

      if (dataUpdate.product_name !== product.product_name) {
        const duplicate_product_name = await Product.findOne({ product_name: dataUpdate.product_name });
        if (duplicate_product_name) {
          return res.status(400).json({ message: "Product name already exists." });
        }
      }
      product.product_name = dataUpdate.product_name;
      product.product_type = dataUpdate.product_type;
      product.product_brand_id = dataUpdate.product_brand_id;
      product.product_age = dataUpdate.product_age;
      product.product_price = dataUpdate.product_price;
      product.product_price_discount = dataUpdate.product_price_discount;
      product.product_img = dataUpdate.product_img;
      product.quantity = dataUpdate.quantity;
      product.product_description = dataUpdate.product_description;
      product.product_status = dataUpdate.product_status;
      await product.save();
      res.status(200).json({ message: `Update ${product.product_name} successfully`, Product: product });
    } catch {
      res.status(400).json({ message: "Internal server error." });
    }
  }
)

const delete_product = asyncHandler(
  async (req, res) => {
    try {
      const { product_id } = req.params;
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(400).json({ message: "No product found." });
      }
      await Product.findByIdAndDelete(product_id);
      res.status(200).json({ message: `Delete ${product.product_name} successfully` });
    } catch {
      res.status(400).json({ message: "Internal server error." });
    }
  }
)

module.exports = { autoCreateStatus, createNewProduct, duplicate_product_name, update_product, delete_product }