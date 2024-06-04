const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("FakeCard", cardSchema);
