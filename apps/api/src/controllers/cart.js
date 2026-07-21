import { Types } from "mongoose";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne({ user: req.session.userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: req.session.userId, items: [] });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (err) {
    return next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const { product, quantity } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
      });
    }

    if (!Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const qty = quantity === undefined ? 1 : parseInt(quantity);

    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      cart = await Cart.create({ user: req.session.userId, items: [] });
    }

    const item = cart.items.find((i) => i.product.toString() === product);

    if (item) {
      item.quantity += qty;
    } else {
      cart.items.push({ product, quantity: qty });
    }

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (err) {
    return next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const { productId } = req.params;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some((i) => i.product.toString() === productId);

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (err) {
    return next(err);
  }
}

export { getCart, addItem, removeItem };
