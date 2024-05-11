const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    items: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Paid', 'Closed', 'Canceled'],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);;