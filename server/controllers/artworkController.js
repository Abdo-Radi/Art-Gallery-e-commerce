const Artwork = require("../models/Artwork");
const { escapeRegex } = require("../utils/regexUtils");

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
    const { search, page, category, priceSort, maxPrice } = req.query;
    const options = {
      lean: true,
      populate: ["artist", "category"],
      page: page || 1,
      limit: 9,
    };

    const searchQuery = {
      ...(search && { title: { $regex: new RegExp(escapeRegex(search), "i") } }),
      ...(category && { category }),
      ...(maxPrice && { price: { $lte: Number(maxPrice) } }),
    };

    if (priceSort) {
      options.sort = { price: priceSort === "lowToHigh" ? 1 : -1 };
    }

    const artworks = await Artwork.paginate(searchQuery, options);

    res.status(200).json(artworks);
  } catch (error) {
    next(error);
  }
};

const getArtworkById = async (req, res, next) => {
  try {
    const artworkId = req.params.id;
    const artwork = await Artwork.findById(artworkId)
      .populate({ path: "category", select: "name" })
      .populate({ path: "artist", select: ["firstName", "lastName"] });

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

    const updatedArtwork = await artwork.save();

    const dataToSend = await Artwork.findById(updatedArtwork._id)
      .populate({ path: "category", select: "name" })
      .populate({ path: "artist", select: ["firstName", "lastName"] });

    res.status(200).json(dataToSend);
  } catch (error) {
    next(error);
  }
};

const deleteArtwork = async (req, res, next) => {
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
  deleteArtwork,
};
