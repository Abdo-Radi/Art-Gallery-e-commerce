const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  lastUpdate: {
    type: Date,
    default: null,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

customerSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Customer", customerSchema);
