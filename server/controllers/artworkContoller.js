const Artwork = require("../models/Artwork");
const mongoose = require("mongoose");

// Create a new artwork
const createArtwork = async (req, res) => {
  try {
    const { artistId, categoryId, title, description, price, imageUrl } =
      req.body;

    // Create a new Artwork instance
    const newArtwork = new Artwork({
      artistId,
      categoryId,
      title,
      description,
      price,
      imageUrl,
    });

    // Save the new Artwork to the database
    const savedArtwork = await newArtwork.save();

    res.status(201).json(savedArtwork);
  } catch (error) {
    console.error("Error creating Artwork:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get list of artworks
const getArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.status(200).json(artworks);
  } catch (error) {
    console.error("Error getting Artworks:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get an artwork by ID
const getArtworkById = async (req, res) => {
  try {
    const artworkId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(artworkId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid artwork ID",
      });
    }

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({
        status: 404,
        message: "Artwork not found",
      });
    }

    res.status(200).json(artwork);
  } catch (error) {
    console.error("Error getting Artwork by ID:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Search for artworks
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
    console.error("Error searching Artworks:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Update an artwork
// Update an artwork
const updateArtwork = async (req, res) => {
  try {
    const artworkId = req.params.id;
    const updateFields = req.body;

    if (!mongoose.Types.ObjectId.isValid(artworkId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid artwork ID",
      });
    }

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({
        status: 404,
        message: "Artwork not found",
      });
    }

    // Update the artwork data
    Object.keys(updateFields).forEach((field) => {
      artwork[field] = updateFields[field];
    });

    // Save the updated artwork to the database
    const updatedArtwork = await artwork.save();

    res.status(200).json(updatedArtwork);
  } catch (error) {
    console.error("Error updating Artwork:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};
// Delete an artwork by ID
const deleteArtworkById = async (req, res) => {
  const artworkId = req.params.id;

  try {
    // Delete the artwork by ID
    const deletedArtwork = await Artwork.findByIdAndDelete(artworkId);

    if (!deletedArtwork) {
      return res.status(404).json({ message: "Artwork not found." });
    }

    return res.status(200).json({ message: "Artwork deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting artwork", error: error.message });
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
