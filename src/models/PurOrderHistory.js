const mongoose = require("mongoose");

const PurchaseOrderHistorySchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.Number,
      ref: "Order",
      required: true,
    },
    order_item_id: {
      type: mongoose.Schema.Types.Number,
      ref: "OrderItem",
      required: true,
    },
  },
  { timestamps: true }
);

const PurchaseOrderHistory = mongoose.model(
  "PurchaseOrderHistory",
  PurchaseOrderHistorySchema
);

module.exports = PurchaseOrderHistory;
