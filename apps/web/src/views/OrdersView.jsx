import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api.js";
import { Alert } from "../components/Alert.jsx";

function StatusBadge({ status }) {
  const cls = {
    pending: "badge-warning",
    paid: "badge-success",
    shipped: "badge-info",
    delivered: "badge-secondary",
    cancelled: "badge-error",
  };
  return (
    <span className={`badge ${cls[status] || "badge-ghost"} capitalize`}>
      {status}
    </span>
  );
}

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.orderHistory();
      setOrders(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function openOrder(orderId) {
    setError("");
    try {
      const res = await api.orderDetails(orderId);
      setSelected(res.data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto">
        <button className="btn btn-link btn-sm mb-2" onClick={() => setSelected(null)}>
          ← Back to orders
        </button>
        <div className="card bg-base-100 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Order</h3>
            <StatusBadge status={selected.status} />
          </div>
          <p className="text-sm opacity-60">
            Placed {new Date(selected.createdAt).toLocaleString()}
          </p>
          <p className="text-sm opacity-60 mb-2">
            Payment: {selected.payment?.status || "—"}
          </p>
          <ul className="divide-y">
            {selected.items.map((i, idx) => (
              <li key={idx} className="py-2 flex justify-between">
                <span>
                  {i.product?.name || "Product"} × {i.quantity}
                </span>
                <span>${i.price * i.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>${selected.totalAmount}</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center py-8">Loading…</div>;
  {error && <Alert type="error">{error}</Alert>}

  if (orders.length === 0) {
    return <Alert type="info">You have no orders yet.</Alert>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && <Alert type="error">{error}</Alert>}
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o._id}>
            <button
              className="w-full text-left card bg-base-100 shadow-sm p-3 flex items-center justify-between hover:bg-base-200"
              onClick={() => openOrder(o._id)}
            >
              <div>
                <p className="font-medium">Order · ${o.totalAmount}</p>
                <p className="text-xs opacity-60">
                  {new Date(o.createdAt).toLocaleDateString()} ·{" "}
                  {o.items.length} item(s)
                </p>
              </div>
              <StatusBadge status={o.status} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
