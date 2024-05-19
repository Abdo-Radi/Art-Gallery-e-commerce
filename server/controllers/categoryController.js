const Category = require('../models/Category');
const mongoose = require('mongoose');

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ message: `The category '${name}' already exists` });
    }

    const newCategory = new Category({
      name,
      description,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const limit = 20;
    const page = parseInt(req.query.page) || 1;
    const skipCount = (page - 1) * limit;

    const totalCategoriesCount = await Category.countDocuments();

    const categories = await Category.find().skip(skipCount).limit(limit);
    console.log(categories)
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.status(200).json({
      data: categories,
      totalPages: Math.ceil(totalCategoriesCount / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};


const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      category.name = name;
    }

    if (description) {
      category.description = description;
    }

    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

const deleteCategoryById = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategoryById
};
