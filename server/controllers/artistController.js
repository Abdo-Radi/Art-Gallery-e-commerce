const Artist = require('../models/Artist');
const { hash } = require('../utils/passwordUtils');

const getArtists = async (req, res, next) => {
  try {
    const limit = 20;
    const page = parseInt(req.query.page) || 1;
    const skipCount = (page - 1) * limit;

    const totalArtistsCount = await Artist.countDocuments();

    const artists = await Artist.find().skip(skipCount).limit(limit);

    if (artists.length === 0) {
      return res.status(204).json({ message: "No artists found" });
    }

    res.status(200).json({
      data: artists,
      totalPages: Math.ceil(totalArtistsCount / limit),
      currentPage: page,
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
      password: hashedPassword
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

const updateArtist = async (req, res,next) => {
  const id = req.params.id;
  const { firstName, lastName, email, bio, active, password } = req.body;

  try {
    const hashedPassword = await hash(password);

    const update = await Artist.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      bio,
      active,
      password: hashedPassword,
      lastUpdate: new Date(),
    });

    if (!update) {
      return res.status(404).json({ message: "Invalid artist id" });
    }

    res.status(200).json({ message: "Artist updated successfully" });
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
  deleteArtist
};
