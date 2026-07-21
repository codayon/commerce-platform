import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "usd",
    },
    provider: {
      type: String,
      default: "stripe",
    },
    status: {
      type: String,
      enum: ["requires_payment", "succeeded", "failed"],
      default: "requires_payment",
    },
    transactionId: {
      type: String,
      default: null,
    },
    raw: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = model("Payment", paymentSchema);

export default Payment;
