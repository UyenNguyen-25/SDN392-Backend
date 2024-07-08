const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const brandController = require("../controllers/brandController");

const router = express.Router();

// router.route("/get-all-brand").get(brandController.getAllBrand);
router.get("/brands", brandController.getAllBrands);

router.use(verifyJWT);

// router.route("/create-brand").post(brandController.createBrand);
router.post("/brands", brandController.createBrand);

module.exports = router;
