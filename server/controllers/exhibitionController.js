const Exhibition = require("../models/Exhibition");

const createExhibition = async (req, res, next) => {
  try {
    const newExhibition = new Exhibition(req.body);
    const savedExhibition = await newExhibition.save();

    res.status(201).json(savedExhibition);
  } catch (error) {
    next(error);
  }
};

const getExhibitions = async (req, res, next) => {
  try {
    const { search, page } = req.query;
    const options = { lean: true, page };

    const searchQuery = {
      name: { $regex: new RegExp(search, "i") },
    };

    const exhibitions = await Exhibition.paginate(searchQuery, options);

    if (exhibitions.length === 0) {
      return res.status(204).json({ message: "No exhibitions found" });
    }

    res.status(200).json(exhibitions);
  } catch (error) {
    next(error);
  }
};

const getExhibitionById = async (req, res, next) => {
  try {
    const exhibitionId = req.params.id;
    const exhibition = await Exhibition.findById(exhibitionId);

    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }

    res.status(200).json(exhibition);
  } catch (error) {
    next(error);
  }
};

const updateExhibition = async (req, res, next) => {
  try {
    const exhibitionId = req.params.id;
    const updatedExhibition = await Exhibition.findByIdAndUpdate(
      exhibitionId,
      req.body,
      { new: true }
    );

    if (!updateExhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }

    res.status(200).json(updatedExhibition);
  } catch (error) {
    next(error);
  }
};

const deleteExhibition = async (req, res, next) => {
  try {
    const exhibitionId = req.params.id;
    const deletedExhibition = await Exhibition.findByIdAndDelete(exhibitionId);

    if (!deletedExhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }

    return res.status(200).json({ message: "Exhibition deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExhibition,
  getExhibitions,
  getExhibitionById,
  updateExhibition,
  deleteExhibition,
};
