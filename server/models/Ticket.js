const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    exhibitionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Exhibition'
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);