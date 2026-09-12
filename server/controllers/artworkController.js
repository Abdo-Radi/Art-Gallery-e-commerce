const Artwork = require("../models/Artwork");
const { escapeRegex } = require("../utils/regexUtils");

const createArtwork = async (req, res, next) => {
  try {
    const fields = { ...req.body };
    // Artists can only publish under their own name, and a new work always
    // starts out available.
    if (req.user.accountType === "artist") {
      fields.artist = req.user.userId;
      delete fields.status;
    }

    const newArtwork = new Artwork(fields);
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
      // Public list: never send more of the artist than their name
      populate: [
        { path: "artist", select: ["firstName", "lastName"] },
        { path: "category", select: "name" },
      ],
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

    // Artists may only edit their own works, and can neither hand a work to
    // another artist nor change whether it has been sold.
    if (req.user.accountType === "artist") {
      if (String(artwork.artist) !== req.user.userId) {
        return res
          .status(403)
          .json({ message: "You can only change your own artworks" });
      }
      delete updateFields.artist;
      delete updateFields.status;
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

    if (req.user.accountType === "artist") {
      const artwork = await Artwork.findById(artworkId).select("artist").lean();
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      if (String(artwork.artist) !== req.user.userId) {
        return res
          .status(403)
          .json({ message: "You can only delete your own artworks" });
      }
    }

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
