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

ticketSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Ticket", ticketSchema);
