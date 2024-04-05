const Order = require("../models/Order");
const mongoose = require("mongoose");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customerId, items, totalAmount, status, date } = req.body;

    // Create a new Order instance
    const newOrder = new Order({
      customerId,
      items,
      totalAmount,
      status,
      date,
    });

    // Save the new Order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating Order:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get list of orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting Orders:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get an order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting Order by ID:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Update an order's details
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { customerId, items, totalAmount, status, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Order not found",
      });
    }

    // Update the order data
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

    // Save the updated order to the database
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating Order:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    // Delete the order by ID
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrderById,
};
