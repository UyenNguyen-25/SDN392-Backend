const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
// const onlineCheckoutController = require("../controllers/onlineCheckoutController");

const router = express.Router();

router.use(verifyJWT);

// router.route("/payment").get(onlineCheckoutController.createPayment);
// router.route("/paymentZalo").get(onlineCheckoutController.createPaymentZaloPay);
// router.route("/callback").post(onlineCheckoutController.callback);

module.exports = router;