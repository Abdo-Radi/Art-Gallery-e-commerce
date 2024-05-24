const Artist = require("../models/Artist");

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

    res.status(200).json(artists);
  } catch (error) {
    next(error);
  }
};

const getArtistById = async (req, res, next) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId);

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
    const updateFields = req.body;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    Object.assign(artist, { ...updateFields, lastUpdate: new Date() });

    const updatedArtist = await artist.save();

    res.status(200).json(updatedArtist);
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
