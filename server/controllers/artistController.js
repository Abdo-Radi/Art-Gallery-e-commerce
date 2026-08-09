const Artist = require("../models/Artist");
const { hash } = require("../utils/passwordUtils");
const { escapeRegex } = require("../utils/regexUtils");

const addArtist = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hashedPassword = await hash(password);

    const newArtist = new Artist({
      ...req.body,
      password: hashedPassword,
    });

    const savedArtist = await newArtist.save();

    const artistToSend = savedArtist.toObject();
    delete artistToSend.password;

    res.status(201).json(artistToSend);
  } catch (error) {
    next(error);
  }
};

const getArtists = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const options = { lean: true, page, limit: limit || 10, select: "-password" };

    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: new RegExp(escapeRegex(search), "i") } },
            { lastName: { $regex: new RegExp(escapeRegex(search), "i") } },
          ],
        }
      : {};

    const artists = await Artist.paginate(searchQuery, options);

    res.status(200).json(artists);
  } catch (error) {
    next(error);
  }
};

const getArtistById = async (req, res, next) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId).select("-password");

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const updateArtist = async (req, res, next) => {
  try {
    const artistId = req.params.id;
    const updateFields = { ...req.body };

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Hash a new password if one was provided; ignore empty values so an
    // edit form leaving the field blank doesn't wipe the password.
    if (updateFields.password) {
      updateFields.password = await hash(updateFields.password);
    } else {
      delete updateFields.password;
    }

    Object.assign(artist, { ...updateFields, lastUpdate: new Date() });

    const updatedArtist = await artist.save();

    const artistToSend = updatedArtist.toObject();
    delete artistToSend.password;

    res.status(200).json(artistToSend);
  } catch (error) {
    next(error);
  }
};

const deleteArtist = async (req, res, next) => {
  try {
    const artistId = req.params.id;
    const deleteArtist = await Artist.findByIdAndDelete(artistId);

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
  updateArtist,
  deleteArtist,
};
