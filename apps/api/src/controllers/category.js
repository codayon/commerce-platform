import Category from "../models/category.js";

async function createCategory(req, res) {
  try {
    const { name, description, parent } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    const category = await Category.create({ name, description, parent });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId).populate("children");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { createCategory, getCategory };
