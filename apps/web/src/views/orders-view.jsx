import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
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

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
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

  if (loading) return <div className="text-center py-8">Loading…</div>;

  if (orders.length === 0) {
    return <Alert type="info">You have no orders yet.</Alert>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && <Alert type="error">{error}</Alert>}
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o._id}>
            <Link
              to={`/orders/${o._id}`}
              className="block card bg-base-100 shadow-sm p-3 flex items-center justify-between hover:bg-base-200"
            >
              <div>
                <p className="font-medium">Order · ${o.totalAmount}</p>
                <p className="text-xs opacity-60">
                  {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)
                </p>
              </div>
              <StatusBadge status={o.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
