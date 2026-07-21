import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api.js";
import { Alert } from "../components/Alert.jsx";

export default function ProductsView({ onCartChange }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

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

  async function handleAdd(productId) {
    try {
      await api.addToCart(productId, 1);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 1500);
      onCartChange?.();
    } catch (err) {
      setError(err.message);
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
      {loading && <div className="text-center py-8">Loading…</div>}

      {!loading && products.length === 0 && (
        <Alert type="info">No products found. Try a different search.</Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">{p.name}</h3>
              <p className="text-sm opacity-70 line-clamp-2">
                {p.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-semibold">${p.price}</span>
                <span className="text-xs opacity-60">
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </span>
              </div>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary btn-sm"
                  disabled={p.stock <= 0}
                  onClick={() => handleAdd(p._id)}
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
