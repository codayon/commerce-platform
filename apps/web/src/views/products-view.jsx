import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api.js";
import { Alert } from "../components/alert.jsx";

export default function ProductsView({ onCartChange }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [addError, setAddError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  // Per-product quantity the user wants before adding to cart.
  const [qtyById, setQtyById] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.all([
        api.listProducts({ q, category }),
        api.listCategories(),
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [q, category]);

  useEffect(() => {
    load();
  }, [load]);

  function getQty(productId) {
    return qtyById[productId] || 1;
  }

  function setQty(productId, next) {
    const clamped = Math.max(1, Math.min(next, 99));
    setQtyById((prev) => ({ ...prev, [productId]: clamped }));
  }

  async function handleAdd(product) {
    setAddError("");
    const qty = getQty(product._id);
    // Respect stock; don't let the user queue more than available.
    if (qty > product.stock) {
      setAddError(`Only ${product.stock} of ${product.name} in stock`);
      return;
    }
    try {
      await api.addToCart(product._id, qty);
      setAddedId(product._id);
      setTimeout(() => setAddedId(null), 1500);
      onCartChange?.();
    } catch (err) {
      setAddError(err.message);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="input input-bordered flex-1"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id} className="capitalize">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {addError && <Alert type="error">{addError}</Alert>}
      {loading && <div className="text-center py-8">Loading…</div>}

      {!loading && products.length === 0 && (
        <Alert type="info">No products found. Try a different search.</Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">{p.name}</h3>
              <p className="text-sm opacity-70 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-semibold">${p.price}</span>
                <span className="text-xs opacity-60">
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </span>
              </div>
              <div className="card-actions justify-end items-center mt-2">
                {p.stock > 0 && (
                  <div className="join">
                    <button
                      type="button"
                      className="btn btn-sm join-item"
                      aria-label={`Decrease ${p.name} quantity`}
                      onClick={() => setQty(p._id, getQty(p._id) - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={p.stock}
                      value={getQty(p._id)}
                      onChange={(e) => setQty(p._id, parseInt(e.target.value) || 1)}
                      className="input input-sm join-item w-14 text-center"
                    />
                    <button
                      type="button"
                      className="btn btn-sm join-item"
                      aria-label={`Increase ${p.name} quantity`}
                      disabled={getQty(p._id) >= p.stock}
                      onClick={() => setQty(p._id, getQty(p._id) + 1)}
                    >
                      +
                    </button>
                  </div>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  disabled={p.stock <= 0}
                  onClick={() => handleAdd(p)}
                >
                  {addedId === p._id ? "Added ✓" : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
