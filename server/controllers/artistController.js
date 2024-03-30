const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Artist = require("../models/Artist");


const addArtist = async (req, res) => {
  const { firstName, lastName, email, username, password, bio } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newArtist = await Artist.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      bio,
      active: true,
      creationDate: new Date(),
    });

    res.status(201).json(newArtist);
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find();

    res.status(200).json({
      status: 200,
      data: artists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving artists" });
  }
};

const getArtistById = async (req, res) => {
  try {
    const id = req.params.id;

    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json({
      status: 200,
      data: artist,
    });
  } catch (error) {
    res.status(400).json({ message: "Cannot find artist" });
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

    res.status(200).json({
      status: 200,
      data: filteredArtists,
    });
  } catch (error) {
    console.error("Error searching artists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateArtist = async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, bio, active, password } = req.body;
  hashedPassword = await bcrypt.hash(password, 10);
  try {
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
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteArtist = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteArtist = await Artist.findByIdAndDelete(id);

    if (!deleteArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Artist deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addArtist,
  getArtists,
  getArtistById,
  searchArtists,
  updateArtist,
  deleteArtist,
};
