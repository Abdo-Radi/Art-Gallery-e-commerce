const Exhibition = require("../models/Exhibition");
const mongoose = require("mongoose");

// Create a new exhibition
const createExhibition = async (req, res) => {
  try {
    const { name, description, date } = req.body;

    // Create a new Exhibition instance
    const newExhibition = new Exhibition({
      name,
      description,
      date,
    });

    // Save the new Exhibition to the database
    const savedExhibition = await newExhibition.save();

    res.status(201).json(savedExhibition);
  } catch (error) {
    console.error("Error creating Exhibition:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get list of exhibitions
const getExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find();
    res.status(200).json(exhibitions);
  } catch (error) {
    console.error("Error getting Exhibitions:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get an exhibition by ID
const getExhibitionById = async (req, res) => {
  try {
    const exhibitionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid exhibition ID",
      });
    }

    const exhibition = await Exhibition.findById(exhibitionId);

    if (!exhibition) {
      return res.status(404).json({
        status: 404,
        message: "Exhibition not found",
      });
    }

    res.status(200).json(exhibition);
  } catch (error) {
    console.error("Error getting Exhibition by ID:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Update an exhibition
const updateExhibition = async (req, res) => {
  try {
    const exhibitionId = req.params.id;
    const { name, description, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid exhibition ID",
      });
    }

    const exhibition = await Exhibition.findById(exhibitionId);

    if (!exhibition) {
      return res.status(404).json({
        status: 404,
        message: "Exhibition not found",
      });
    }

    // Update the exhibition data
    if (name) {
      exhibition.name = name;
    }

    if (description) {
      exhibition.description = description;
    }

    if (date) {
      exhibition.date = date;
    }

    // Save the updated exhibition to the database
    const updatedExhibition = await exhibition.save();

    res.status(200).json(updatedExhibition);
  } catch (error) {
    console.error("Error updating Exhibition:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Delete an exhibition
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
    return res
      .status(500)
      .json({ message: "Error deleting exhibition", error: error.message });
  }
};

module.exports = {
  createExhibition,
  getExhibitions,
  getExhibitionById,
  updateExhibition,
  deleteExhibitionById,
};
