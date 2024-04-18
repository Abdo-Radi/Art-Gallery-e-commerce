const Order = require('../models/Order');
const mongoose = require('mongoose');

const createOrder = async (req, res) => {
  try {
    const { customerId, items, totalAmount, status, date } = req.body;

    const newOrder = new Order({
      customerId,
      items,
      totalAmount,
      status,
      date
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const skipCount = (page - 1) * limit;

    const totalOrdersCount = await Order.countDocuments();
    const orders = await Order.find().skip(skipCount).limit(limit);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      data: orders,
      totalPages: Math.ceil(totalOrdersCount / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { customerId, items, totalAmount, status, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (customerId !== undefined) {
      order.customerId = customerId;
    }

    if (items !== undefined) {
      order.items = items;
    }

    if (totalAmount !== undefined) {
      order.totalAmount = totalAmount;
    }

    if (status !== undefined) {
      order.status = status;
    }

    if (date !== undefined) {
      order.date = date;
    }

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

const deleteOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrderById
};
