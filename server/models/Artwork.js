const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const artworkSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Artist",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

artworkSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Artwork", artworkSchema);
