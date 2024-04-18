const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Artist',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
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
  images: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('Artwork', artworkSchema);
