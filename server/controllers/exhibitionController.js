const Exhibition = require('../models/Exhibition');
const mongoose = require('mongoose');

const createExhibition = async (req, res, next) => {
  try {
    const { name, description, date } = req.body;
    
    const newExhibition = new Exhibition({
      name,
      description,
      date
    });
    const savedExhibition = await newExhibition.save();

    res.status(201).json(savedExhibition);
  } catch (error) {
    next(error);
  }
};

const getExhibitions = async (req, res, next) => {
  try {
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const skipCount = (page - 1) * limit;

    const totalExhibitionsCount = await Exhibition.countDocuments();
    const exhibitions = await Exhibition.find().skip(skipCount).limit(limit);

    if (exhibitions.length === 0) {
      return res.status(404).json({ message: "No exhibitions found" });
    }

    res.status(200).json({
      data: exhibitions,
      totalPages: Math.ceil(totalExhibitionsCount / limit),
      currentPage: page
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

    return res.status(200).json({ message: "Exhibition deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExhibition,
  getExhibitions,
  getExhibitionById,
  updateExhibition,
  deleteExhibitionById
};
