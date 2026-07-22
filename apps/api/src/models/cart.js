import { Schema, model } from "mongoose";

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // Present for guest (not-yet-log-in) carts, keyed by the visitor's
    // session id. Exactly one of `user` / `sessionId` identifies a cart.
    sessionId: {
      type: String,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

// A cart is owned by either a logged-in user or a guest session, never both.
// Enforce a single cart per owner and support fast guest lookups.
cartSchema.index({ user: 1 }, { unique: true, sparse: true });
cartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

const Cart = model("Cart", cartSchema);

export default Cart;
