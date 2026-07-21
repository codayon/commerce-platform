import { Types } from "mongoose";
import Order from "../models/order.js";
import Cart from "../models/cart.js";

async function createOrder(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.session.userId }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const items = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "A product in your cart no longer exists",
        });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}"`,
        });
      }

      product.stock -= cartItem.quantity;
      await product.save();

      items.push({
        product: product._id,
        quantity: cartItem.quantity,
        price: product.price,
      });

      totalAmount += product.price * cartItem.quantity;
    }

    const order = await Order.create({
      user: req.session.userId,
      items,
      totalAmount,
      status: "pending",
    });

    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id).populate(
      "items.product",
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: populatedOrder,
    });
  } catch (err) {
    return next(err);
  }
}

async function getOrderHistory(req, res, next) {
  try {
    const orders = await Order.find({ user: req.session.userId })
      .sort("-createdAt")
      .populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      data: orders,
    });
  } catch (err) {
    return next(err);
  }
}

async function getOrderDetails(req, res, next) {
  try {
    const { orderId } = req.params;

    if (!Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.session.userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (err) {
    return next(err);
  }
}

export { createOrder, getOrderHistory, getOrderDetails };
