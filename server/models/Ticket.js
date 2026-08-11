const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const ticketSchema = new mongoose.Schema({
  exhibition: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Exhibition",
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Tickets are filtered by exhibition and sorted by price
ticketSchema.index({ exhibition: 1 });
ticketSchema.index({ price: 1 });

ticketSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Ticket", ticketSchema);
