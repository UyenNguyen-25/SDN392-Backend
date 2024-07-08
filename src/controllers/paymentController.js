const asyncHandler = require("express-async-handler");
const Payment = require("../models/Payment");

const getPaymentByOrderId = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    try {
      const payment = await Payment.findOne({ order_id: orderId }); 
  
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      res.status(200).json(payment); 
    } catch (error) {
      console.error('Error fetching payment details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {
    getPaymentByOrderId
}