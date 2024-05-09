const Artwork = require('../models/Artwork');
const mongoose = require('mongoose');

const createArtwork = async (req, res, next) => {
  try {
    const { artist, category, title, description, price ,image} = req.body;

    const newArtwork = new Artwork({
      artist,
      category,
      title,
      description,
      price,
      image
    });
    let savedArtwork = await newArtwork.save();

    const dataToSend = await Artwork.findById(savedArtwork._id)
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'artist', select: ['firstName', 'lastName'] });

    res.status(201).json(dataToSend);
  } catch (error) {
    next(error);
  }
};

const getArtworks = async (req, res, next) => {
  try {
    const limit = 20;
    const page = parseInt(req.query.page) || 1;
    const skipCount = (page - 1) * limit;

    const totalArtworksCount = await Artwork.countDocuments();

    const artworks = await Artwork.find()
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'artist', select: ['firstName', 'lastName'] })
      .skip(skipCount)
      .limit(limit);

    if (artworks.length === 0) {
      return res.status(204).json({ message: "No artworks found" });
    }

    res.status(200).json({
      data: artworks,
      totalPages: Math.ceil(totalArtworksCount / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

const getArtworkById = async (req, res) => {
  try {
    const artworkId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(artworkId)) {
      return res.status(400).json({ message: "Invalid artwork ID" });
    }

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.status(200).json(artwork);
  } catch (error) {
    next(error);

  }
};

const searchArtworks = async (req, res) => {
  try {
    const query = req.query.query;

    const artworks = await Artwork.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(artworks);
  } catch (error) {
    next(error);
  }
};

const updateArtwork = async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const updateFields = req.body;

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    Object.keys(updateFields).forEach((field) => {
      artwork[field] = updateFields[field];
    });

    if (req.file)
      artwork["image"] = req.file.filename

    let updateArtwork = await artwork.save();

    const dataToSend = await Artwork.findById(updateArtwork._id)
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'artist', select: ['firstName', 'lastName'] });

    res.status(200).json(dataToSend);
  } catch (error) {
    next(error);
  }
};

const deleteArtworkById = async (req, res) => {
  const artworkId = req.params.id;

  try {
    const deletedArtwork = await Artwork.findByIdAndDelete(artworkId);

    if (!deletedArtwork) {
      return res.status(404).json({ message: "Artwork not found." });
    }

    return res.status(200).json({ message: "Artwork deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createArtwork,
  getArtworks,
  getArtworkById,
  searchArtworks,
  updateArtwork,
  deleteArtworkById
};