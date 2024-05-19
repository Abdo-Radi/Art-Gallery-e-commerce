const Artwork = require("../models/Artwork");
const mongoose = require("mongoose");

const createArtwork = async (req, res, next) => {
  try {
    const { artist, category, title, description, price, image } = req.body;

    const newArtwork = new Artwork({
      artist,
      category,
      title,
      description,
      price,
      image,
    });
    let savedArtwork = await newArtwork.save();

    const dataToSend = await Artwork.findById(savedArtwork._id)
      .populate({ path: "category", select: "name" })
      .populate({ path: "artist", select: ["firstName", "lastName"] });

    res.status(201).json(dataToSend);
  } catch (error) {
    next(error);
  }
};

const getArtworks = async (req, res, next) => {
  try {
    const { search, page } = req.query;
    const options = {
      lean: true,
      populate: ["artist", "category"],
      page,
    };

    const searchQuery = {
      title: { $regex: new RegExp(search, "i") },
    };

    const artworks = await Artwork.paginate(searchQuery, options);

    if (artworks.length === 0) {
      return res.status(204).json({ message: "No artworks found" });
    }

    const totalDocs = await Artwork.countDocuments();

    res.status(200).json({
      ...artworks,
      totalDocs,
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

    const oldImage = artwork.image;

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    Object.keys(updateFields).forEach((field) => {
      artwork[field] = updateFields[field];
    });

    if (updateFields["image"] == "") artwork["image"] = oldImage;

    let updateArtwork = await artwork.save();

    const dataToSend = await Artwork.findById(updateArtwork._id)
      .populate({ path: "category", select: "name" })
      .populate({ path: "artist", select: ["firstName", "lastName"] });

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
  deleteArtworkById,
};
