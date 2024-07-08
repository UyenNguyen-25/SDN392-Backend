const express = require("express");
const productController = require("../controllers/productController");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

// router.route("/get-all-product").get(productController.get_all_product);
// router
//   .route("/get-product-by-id/:product_id")
router.get("/products/:product_id", productController.getProductById);
//   .get(productController.get_product_by_id);

router.route("/get-product-status").get(productController.getProductStatus);

router.use(verifyJWT);

// router.route("/create-product").post(productController.createNewProduct);
//   .route("/check-product-duplicate")
//   .post(productController.duplicate_product_name);
// router
//   .route("/update-product/:product_id")
//   .put(productController.update_product);
// router
//   .route("/delete-product/:product_id")
//   .delete(productController.delete_product);

module.exports = router;
