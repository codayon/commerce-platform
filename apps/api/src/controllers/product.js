import { Types } from "mongoose";
import Product from "../models/product.js";

async function createProduct(req, res, next) {
  try {
    const { name, description, price, category, stock, images } = req.body;

    const requiredFields = ["name", "description", "price", "category"];

    for (const field of requiredFields) {
      if (req.body[field] === undefined) {
        return res.status(400).json({
          success: false,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const { productId } = req.params;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    return next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { productId } = req.params;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const allowedFields = ["name", "description", "price", "category", "stock", "images"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    return next(err);
  }
}

async function listProducts(req, res, next) {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined && minPrice !== "") {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filter.price = { ...filter.price, $gte: min };
      }
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filter.price = { ...filter.price, $lte: max };
      }
    }

    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category")
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
        products,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export { createProduct, deleteProduct, getProduct, updateProduct, listProducts };
