const Artwork = require("../models/Artwork");

const createArtwork = async (req, res, next) => {
  try {
    const newArtwork = new Artwork(req.body);
    const savedArtwork = await newArtwork.save();

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

    res.status(200).json({ artworks });
  } catch (error) {
    next(error);
  }
};

const getArtworkById = async (req, res) => {
  try {
    const artworkId = req.params.id;
    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.status(200).json(artwork);
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

    if (updateFields.image === "") {
      updateFields.image = artwork.image;
    }

    Object.assign(artwork, updateFields);

    const updateArtwork = await artwork.save();

    const dataToSend = await Artwork.findById(updateArtwork._id)
      .populate({ path: "category", select: "name" })
      .populate({ path: "artist", select: ["firstName", "lastName"] });

    res.status(200).json(dataToSend);
  } catch (error) {
    next(error);
  }
};

const deleteArtworkById = async (req, res) => {
  try {
    const artworkId = req.params.id;
    const deletedArtwork = await Artwork.findByIdAndDelete(artworkId);

    if (!deletedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    return res.status(200).json({ message: "Artwork deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createArtwork,
  getArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtworkById,
};
