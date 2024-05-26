const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const exhibitionSchema = new mongoose.Schema({
  name: {
    type: String,
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
});

exhibitionSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Exhibition", exhibitionSchema);
