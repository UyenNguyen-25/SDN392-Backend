const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.String,
      ref: "Order",
      required: true,
    },
    payment_date: {
      type: Date,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
