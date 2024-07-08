const asyncHandler = require("express-async-handler");
const OrderStatus = require("../models/OrderStatus");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const Payment = require("../models/Payment");

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

const getOrderStatus = asyncHandler(async (req, res) => {

    try {
        const status = await OrderStatus.find();
        if (!status?.length) {
            return res.status(400).json({ message: "No order status found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error.');
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { user_id,
        order_items,
        payment_method,
        shippingAddress } = req.body;


    if (!user_id || !order_items || !Array.isArray(order_items) || !shippingAddress) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    // const { name, phone, fullAddress } = shippingAddress;
    const fullname = shippingAddress.fullname;
    const phoneNumber = shippingAddress.phoneNumber;
    const fullAddress = shippingAddress.fullAddress;

    const pendingStatus = await OrderStatus.findOne({ order_status_description: 'pending' });
    if (!pendingStatus) {
        throw new Error('Pending status not found');
    }
    const order_status_id = pendingStatus._id;


    const orderItemIds = await Promise.all(order_items.map(async (item) => {
        const product = await Product.findById(item.product_id).select('product_price');
        if (!product) {
            throw new Error(`Product with id ${item.product_id} not found`);
        }

        const orderItem = new OrderItem({
            quantity: item.quantity,
            product_id: item.product_id,
            price: product.product_price
        });
        await orderItem.save();
        return orderItem._id;
    }));

    const totalPrices = await Promise.all(orderItemIds.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId);
        if (orderItem && orderItem.price) {
            const totalPrice = orderItem.price * orderItem.quantity;
            return totalPrice;
        } else {
            console.log("error");
            throw new Error(`OrderItem with id ${orderItemId} not found`);
        }
    }));

    // Sum up total prices
    const totalAmount = totalPrices.reduce((acc, curr) => acc + curr, 0)


    const order = new Order({
        user_id,
        order_items: orderItemIds,
        total_money: totalAmount,
        order_status_id,
        address: { fullname, phoneNumber, fullAddress }
    })

    await order.save();

    const newPayment = new Payment({
        order_id: order._id,
        payment_method,
        payment_status: "Unpaid"
    });
    await newPayment.save();

    if (!order)
        return res.status(400).send('the order cannot be created!')
    return res.status(201).json(order);
    
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { statusUpdate } = req.body;
        const { orderId } = req.params;

        const orderstatus = await OrderStatus.findOne({
            order_status_description: statusUpdate
        });
        if (!orderstatus) {
            return res.status(400).json({ message: "No order status found" });
        } else {
            const idordertatus = orderstatus._id;
            await Order.findByIdAndUpdate(
                orderId,
                { order_status_id: idordertatus }
            );
            const updateOrderStatus = await Order.findOne({ _id: orderId }).populate('order_status_id')
            res.status(200).json({ message: "Update order status susscessfull" });
            console.log(updateOrderStatus);
            console.log(orderstatus);
            console.log(idordertatus);
        }
    } catch (error) {
        console.log(error);
    }
    
});

const getOrderDetail = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID required" });
        }
        const order = await Order.findById(orderId)
            .populate('order_items')
            .populate('order_status_id')
            .exec();
        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
});

const getOrderByStatusAndUserId = asyncHandler(async (req, res) => {
    const { userId, status } = req.body;

    try {
        const orderStatus = await OrderStatus.findOne({ order_status_description: status });

        if (!orderStatus) {
            return res.status(404).json({ message: 'Không tìm thấy trạng thái đơn hàng.' });
        }

        const orders = await Order.find({ user_id: userId, order_status_id: orderStatus._id })
            .populate('order_items')
            .populate('order_status_id')
            .exec();

            if (!orders.length) {
                return res.status(200).json([]);
            }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy đơn hàng.' });
    }
    
});

module.exports = {autoCreateStatus, getOrderStatus, createOrder, updateOrderStatus, getOrderDetail, getOrderByStatusAndUserId}