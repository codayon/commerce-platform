import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api.js";
import { Alert } from "../components/Alert.jsx";

export default function CartView({ onCartChange }) {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [justOrdered, setJustOrdered] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.getCart();
      setCart(res.data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRemove(productId) {
    try {
      await api.removeFromCart(productId);
      await load();
      onCartChange?.();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCheckout() {
    setError("");
    setBusy(true);
    try {
      await api.createOrder();
      setJustOrdered(true);
      await load();
      onCartChange?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!cart) {
    return <div className="text-center py-8">Loading…</div>;
  }

  if (justOrdered) {
    return (
      <div className="mx-auto max-w-md text-center">
        <Alert type="success">
          Order placed! It is now waiting for payment confirmation.
        </Alert>
        <button
          className="btn btn-primary mt-4"
          onClick={() => setJustOrdered(false)}
        >
          Back to cart
        </button>
      </div>
    );
  }

  const items = cart.items || [];
  const total = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <Alert type="info">
        Your cart is empty. Browse products and add something you like.
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && <Alert type="error">{error}</Alert>}
      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i.product?._id}
            className="flex items-center justify-between bg-base-100 shadow-sm rounded-box p-3"
          >
            <div>
              <p className="font-medium">{i.product?.name || "Product"}</p>
              <p className="text-sm opacity-60">
                ${i.product?.price} × {i.quantity}
              </p>
            </div>
            <button
              className="btn btn-ghost btn-sm text-error"
              onClick={() => handleRemove(i.product?._id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-4">
        <span className="text-lg font-semibold">Total: ${total}</span>
        <button
          className="btn btn-primary"
          disabled={busy}
          onClick={handleCheckout}
        >
          {busy ? "Placing order…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
