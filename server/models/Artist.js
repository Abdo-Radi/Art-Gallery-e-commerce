const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const artistSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: String,
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

artistSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Artist", artistSchema);
