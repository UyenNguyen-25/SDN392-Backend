const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    order_items_id: {
      type: mongoose.Schema.Types.Number,
      ref: "OrderItem",
      required: true,
    },
    feedback_rating: {
      type: Number,
      required: true,
    },
    feedback_description: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = Feedback;
