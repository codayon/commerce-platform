import { Types } from "mongoose";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Resolve the cart owner from the request: a logged-in user (preferred) or a
// guest session. We always force the session cookie to persist so guests have
// a stable cart across requests.
function resolveOwner(req) {
  if (req.session.userId) {
    return { user: req.session.userId };
  }
  if (!req.session.cartSessionId) {
    req.session.cartSessionId = new Types.ObjectId().toString();
  }
  return { sessionId: req.session.cartSessionId };
}

async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne(resolveOwner(req)).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ ...resolveOwner(req), items: [] });
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

    const owner = resolveOwner(req);
    let cart = await Cart.findOne(owner);

    if (!cart) {
      cart = await Cart.create({ ...owner, items: [] });
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

    const cart = await Cart.findOne(resolveOwner(req));

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

// Set an item's quantity to an absolute value. If the quantity is 0 or less
// the line is removed from the cart. Used by the +/- steppers in the UI.
async function updateQuantity(req, res, next) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative integer",
      });
    }

    const cart = await Cart.findOne(resolveOwner(req)).populate("items.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.product._id.toString() !== productId);
    } else {
      const item = cart.items.find((i) => i.product._id.toString() === productId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart",
        });
      }
      if (item.product.stock != null && qty > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${item.product.stock} in stock`,
        });
      }
      item.quantity = qty;
    }

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (err) {
    return next(err);
  }
}

// Merge a guest's session cart into the logged-in user's cart. Called by the
// auth flow right after a session is established. The guest cart is removed
// once its items are folded into the user cart.
async function mergeGuestCart(sessionId, userId) {
  if (!sessionId || !userId) return;

  const guestCart = await Cart.findOne({ sessionId });
  if (!guestCart || guestCart.items.length === 0) return;

  let userCart = await Cart.findOne({ user: userId });
  if (!userCart) {
    userCart = await Cart.create({ user: userId, items: [] });
  }

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (i) => i.product.toString() === guestItem.product.toString(),
    );
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      userCart.items.push({ product: guestItem.product, quantity: guestItem.quantity });
    }
  }

  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });
}

export { getCart, addItem, removeItem, updateQuantity, mergeGuestCart };
