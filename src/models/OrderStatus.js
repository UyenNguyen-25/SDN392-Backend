const mongoose = require("mongoose");

const OrderStatusSchema = new mongoose.Schema(
  {
    order_status_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OrderStatus = mongoose.model("OrderStatus", OrderStatusSchema);

module.exports = OrderStatus;
