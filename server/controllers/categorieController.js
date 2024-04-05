const Category = require("../models/Category");
const mongoose = require("mongoose");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if the category name already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        status: 400,
        message: `The category '${name}' already exists`,
      });
    }

    // Create a new Category instance
    const newCategory = new Category({
      name,
      description,
    });

    // Save the new Category to the database
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating Category:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get list of Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting Categories:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Category not found",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error getting Category by ID:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        status: 404,
        message: "Category not found",
      });
    }

    // Update the category data
    if (name) {
      category.name = name;
    }

    if (description) {
      category.description = description;
    }

    // Save the updated category to the database
    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating Category:", error);
    res.status(500).json({ status: 500, message: "Internal server Error" });
  }
};


// Delete a category
const deleteCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategoryById,
};
