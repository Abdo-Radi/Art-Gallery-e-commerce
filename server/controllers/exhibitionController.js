const Exhibition = require("../models/Exhibition");
const mongoose = require("mongoose");

const createExhibition = async (req, res, next) => {
  try {
    const { name, description, date } = req.body;

    const newExhibition = new Exhibition({
      name,
      description,
      date,
    });
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

    const totalDocs = await Exhibition.countDocuments();

    res.status(200).json({
      ...exhibitions,
      totalDocs,
    });
  } catch (error) {
    next(error);
  }
};

const getExhibitionById = async (req, res, next) => {
  try {
    const exhibitionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: "Invalid exhibition ID" });
    }

    const exhibition = await Exhibition.findById(exhibitionId);

    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }

    res.status(200).json(exhibition);
  } catch (error) {
    next(error);
  }
};

const updateExhibition = async (req, res) => {
  try {
    const exhibitionId = req.params.id;
    const { name, description, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: "Invalid exhibition ID" });
    }

    const exhibition = await Exhibition.findById(exhibitionId);

    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }

    if (name) {
      exhibition.name = name;
    }

    if (description) {
      exhibition.description = description;
    }

    if (date) {
      exhibition.date = date;
    }

    const updatedExhibition = await exhibition.save();

    res.status(200).json(updatedExhibition);
  } catch (error) {
    next(error);
  }
};

const deleteExhibitionById = async (req, res) => {
  const exhibitionId = req.params.id;

  try {
    const deletedExhibition = await Exhibition.findByIdAndDelete(exhibitionId);

    if (!deletedExhibition) {
      return res.status(404).json({ message: "Exhibition not found." });
    }

    return res
      .status(200)
      .json({ message: "Exhibition deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExhibition,
  getExhibitions,
  getExhibitionById,
  updateExhibition,
  deleteExhibitionById,
};
