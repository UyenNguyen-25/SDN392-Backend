const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    total_money: {
      type: Number,
      required: true,
    },
    order_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderStatus",
      default: "666c24fef787959e8ad3c51a",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
