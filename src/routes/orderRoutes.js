const express = require("express");
const orderController = require("../controllers/orderController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.use(verifyJWT);
router.route("/update-order-status/:orderId").post(orderController.updateOrderStatus)
router.route("/create-new-order").post(orderController.createOrder);
router.route("/get-order-status").post(orderController.getOrderStatus);

module.exports = router;