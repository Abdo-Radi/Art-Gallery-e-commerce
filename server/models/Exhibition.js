const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const exhibitionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

exhibitionSchema.plugin(mongoosePagination);

const Exhibition = mongoose.model("Exhibition", exhibitionSchema);

module.exports = Exhibition;
