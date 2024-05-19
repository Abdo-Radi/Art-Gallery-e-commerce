const Artist = require("../models/Artist");
const { hash } = require("../utils/passwordUtils");

const getArtists = async (req, res, next) => {
  try {
    const { search, page } = req.query;
    const options = { lean: true, page };

    const searchQuery = {
      $or: [
        { firstName: { $regex: new RegExp(search, "i") } },
        { lastName: { $regex: new RegExp(search, "i") } },
      ],
    };

    const artists = await Artist.paginate(searchQuery, options);

    if (artists.length === 0) {
      return res.status(204).json({ message: "No artists found" });
    }

    const totalDocs = await Artist.countDocuments();

    res.status(200).json({
      ...artists,
      totalDocs,
    });
  } catch (error) {
    next(error);
  }
};

const addArtist = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hashedPassword = await hash(password);

    const newArtist = new Artist({
      ...req.body,
      password: hashedPassword,
    });

    const savedArtist = await newArtist.save();

    res.status(201).json(savedArtist);
  } catch (error) {
    next(error);
  }
};

const getArtistById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const searchArtists = async (req, res) => {
  const { query } = req.query;

  try {
    const regexQuery = new RegExp(query, "i");

    const filteredArtists = await Artist.find({
      $or: [
        { firstName: { $regex: regexQuery } },
        { lastName: { $regex: regexQuery } },
        { email: { $regex: regexQuery } },
        { username: { $regex: regexQuery } },
        { bio: { $regex: regexQuery } },
      ],
    });

    res.status(200).json({ data: filteredArtists });
  } catch (error) {
    next(error);
  }
};

const updateArtist = async (req, res, next) => {
  const id = req.params.id;
  const updateFields = req.body;

  try {
    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({ message: "Invalid artist id" });
    }

    Object.keys(updateFields).forEach((field) => {
      artist[field] = updateFields[field];
    });

    artist["lastUpdate"] = new Date();

    const updatedArtist = await artist.save();

    res.status(200).json(updatedArtist);
  } catch (error) {
    next(error);
  }
};

const deleteArtist = async (req, res, next) => {
  const id = req.params.id;

  try {
    const deleteArtist = await Artist.findByIdAndDelete(id);

    if (!deleteArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json({ message: "Artist deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArtists,
  addArtist,
  getArtistById,
  searchArtists,
  updateArtist,
  deleteArtist,
};
