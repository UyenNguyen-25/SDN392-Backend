const express = require("express");
const path = require("path");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes")
const productRoutes = require("./productRoutes")
const brandRoutes = require("./brandRoute")
const orderRoutes = require("./orderRoutes")
const onlineCheckoutRoutes = require("./onlineCheckoutRoutes")
const feedbackRoutes = require("./feedbackRoutes")

const router = express.Router();

router.get("^/$|/app(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.use("/auth", authRoutes);

router.use("/api/user", userRoutes);

router.use("/api/product", productRoutes);

router.use("/api/brand", brandRoutes);

router.use("/api/order", orderRoutes);

router.use("/api/momo", onlineCheckoutRoutes);

router.use("/api/feedback", feedbackRoutes);

module.exports = router;
