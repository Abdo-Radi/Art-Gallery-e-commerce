const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  items: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Paid", "Closed", "Canceled"],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// The dashboard aggregates paid orders; the list sorts by date
orderSchema.index({ status: 1 });
orderSchema.index({ date: -1 });

orderSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Order", orderSchema);
