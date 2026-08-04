import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router";
import { api } from "../lib/api.js";
import { Alert } from "../components/alert.jsx";

function StatusBadge({ status }) {
  const cls = {
    pending: "badge-warning",
    paid: "badge-success",
    shipped: "badge-info",
    delivered: "badge-secondary",
    cancelled: "badge-error",
  };
  return <span className={`badge ${cls[status] || "badge-ghost"} capitalize`}>{status}</span>;
}

export default function OrderDetailView() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.orderDetails(orderId);
      setOrder(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <div className="text-center py-8">Loading…</div>;

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto">
        {error && <Alert type="error">{error}</Alert>}
        <Link to="/orders" className="btn btn-link btn-sm">
          ← Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/orders" className="btn btn-link btn-sm mb-2">
        ← Back to orders
      </Link>
      <div className="card bg-base-100 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Order</h3>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm opacity-60">Placed {new Date(order.createdAt).toLocaleString()}</p>
        <p className="text-sm opacity-60 mb-2">Payment: {order.payment?.status || "—"}</p>
        <ul className="divide-y">
          {order.items.map((i, idx) => (
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
          <span>${order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}
