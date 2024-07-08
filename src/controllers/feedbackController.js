const Feedback = require('../models/Feedback');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');

// Create a new feedback
const createFeedback = async (req, res) => {
  try {
    const { order_items_id, feedback_rating, feedback_description } = req.body;
    const user_id = req.user_id; // Assuming user ID is available in req.user

    // Check if the order item exists and belongs to the user
    const order = await Order.findOne({ user_id, order_items: order_items_id }).populate('order_status_id');
    if (!order) {
      return res.status(400).json({ message: "Invalid order item or user does not own this order item" });
    }

    // Check if the order status is "completed"
    if (order.order_status_id.order_status_description !== "completed") {
      return res.status(400).json({ message: "Feedback can only be given for completed orders" });
    }

    // Check if the user has already given feedback for this order item
    const existingFeedback = await Feedback.findOne({ order_items_id });
    if (existingFeedback) {
      return res.status(400).json({ message: "Feedback already exists for this order item" });
    }

    const newFeedback = new Feedback({
      order_items_id,
      feedback_rating,
      feedback_description
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing feedback
const updateFeedback = async (req, res) => {
  try {
    const { feedback_id } = req.params;
    const { feedback_rating, feedback_description } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedback_id,
      { feedback_rating, feedback_description },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a feedback
const deleteFeedback = async (req, res) => {
  try {
    const { feedback_id } = req.params;

    const deletedFeedback = await Feedback.findByIdAndDelete(feedback_id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
