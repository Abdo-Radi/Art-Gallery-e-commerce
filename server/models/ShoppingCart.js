const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "productType",
    },
    productType: {
      type: String,
      required: true,
      enum: ["Artwork", "Exhibition"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { _id: false }
);

const shoppingCartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema);
