const Payment = require("../models/payment");
const mongoose = require("mongoose");

// Record a new payment for an order
const recordPayment = async (req, res) => {
  try {
    const { orderId, amount, date } = req.body;

    // Create a new Payment instance
    const newPayment = new Payment({
      orderId,
      amount,
      date,
    });

    // Save the new Payment to the database
    const savedPayment = await newPayment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error recording Payment:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get list of payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error getting Payments:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get a payment by ID
const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        status: 404,
        message: "Payment not found",
      });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error getting Payment by ID:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Update a payment's details
const updatePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { orderId, amount, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        status: 404,
        message: "Payment not found",
      });
    }

    // Update the payment data
    if (orderId !== undefined) {
      payment.orderId = orderId;
    }

    if (amount !== undefined) {
      payment.amount = amount;
    }

    if (date !== undefined) {
      payment.date = date;
    }

    // Save the updated payment to the database
    const updatedPayment = await payment.save();

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("Error updating Payment:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Delete a payment by ID
const deletePaymentById = async (req, res) => {
  const paymentId = req.params.id;

  try {
    // Delete the payment by ID
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    return res.status(200).json({ message: "Payment deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting payment", error: error.message });
  }
};

module.exports = {
  recordPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePaymentById,
};
