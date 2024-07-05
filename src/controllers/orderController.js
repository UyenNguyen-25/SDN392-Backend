const asyncHandler = require("express-async-handler");
const OrderStatus = require("../models/OrderStatus");

const autoCreateStatus = asyncHandler(async (req, res) => {

    try {
        const statuses = ["pending", "processing", "cancelled", "delivering", "completed"];

        for (const item of statuses) {
            await OrderStatus.create({
                order_status_description: item,
            });
        }

        res.status(200).json('auto create order status successfullly')
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error.')
    }
});

module.exports = {autoCreateStatus}