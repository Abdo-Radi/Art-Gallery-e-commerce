const Payment = require('../models/payment');
const mongoose = require('mongoose');

const recordPayment = async (req, res, next) => {
  try {
    const { orderId, amount, date } = req.body;

    const newPayment = new Payment({
      orderId,
      amount,
      date
    });

    const savedPayment = await newPayment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    next(error);
  }
};

const getPayments = async (req, res, next) => {
  try {
    const limit = 20;
    const page = parseInt(req.query.page) || 1;
    const skipCount = (page - 1) * limit;

    const totalPaymentsCount = await Payment.countDocuments();
    const payments = await Payment.find().skip(skipCount).limit(limit);

    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found" });
    }

    res.status(200).json({
      data: payments,
      totalPages: Math.ceil(totalPaymentsCount / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const paymentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    const { orderId, amount, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (orderId !== undefined) {
      payment.orderId = orderId;
    }

    if (amount !== undefined) {
      payment.amount = amount;
    }

    if (date !== undefined) {
      payment.date = date;
    }

    const updatedPayment = await payment.save();

    res.status(200).json(updatedPayment);
  } catch (error) {
    next(error);
  }
};

const deletePaymentById = async (req, res, next) => {
  const paymentId = req.params.id;

  try {
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    return res.status(200).json({ message: "Payment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePaymentById
};
