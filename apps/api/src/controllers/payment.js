import crypto from "node:crypto";
import { Types } from "mongoose";
import Order from "../models/order.js";
import Payment from "../models/payment.js";

function verifySignature(rawBody, signature, secret) {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody || "")
    .digest("hex");
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(signature);
  return (
    expectedBuf.length === providedBuf.length && crypto.timingSafeEqual(expectedBuf, providedBuf)
  );
}

async function paymentWebhook(req, res, next) {
  try {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Webhook secret is not configured",
      });
    }

    const signature = req.get("x-payment-signature");

    if (!verifySignature(req.rawBody, signature, secret)) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const { orderId, status, transactionId } = req.body;

    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!["succeeded", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payment = await Payment.findById(order.payment);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (status === "succeeded") {
      payment.status = "succeeded";
      payment.transactionId = transactionId || null;
      payment.raw = req.body;
      await payment.save();

      order.status = "paid";
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment succeeded",
        data: { orderId: order._id, status: order.status },
      });
    }

    // status === "failed": release reserved stock and mark as failed
    for (const item of order.items) {
      const product = item.product;
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    payment.status = "failed";
    payment.transactionId = transactionId || null;
    payment.raw = req.body;
    await payment.save();

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment failed",
      data: { orderId: order._id, status: order.status },
    });
  } catch (err) {
    return next(err);
  }
}

export { paymentWebhook };
