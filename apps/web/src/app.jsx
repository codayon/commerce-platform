import { useEffect, useState } from "react";
import { api } from "./lib/api.js";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { Alert } from "./components/Alert.jsx";
import AuthView from "./views/AuthView.jsx";
import ProductsView from "./views/ProductsView.jsx";
import CartView from "./views/CartView.jsx";
import OrdersView from "./views/OrdersView.jsx";
import AccountView from "./views/AccountView.jsx";

function Shell() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("products");
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");

  async function refreshCart() {
    try {
      const res = await api.getCart();
      setCartCount((res.data.items || []).length);
    } catch {
      // silently ignore; cart requires auth and may be empty
    }
  }

  useEffect(() => {
    if (user) refreshCart();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">Loading…</div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-1 px-4 text-lg font-bold">Commerce Platform</div>
        </div>
        <main className="p-4">
          <AuthView />
        </main>
      </div>
    );
  }

  const tabs = [
    { id: "products", label: "Shop" },
    { id: "cart", label: "Cart" },
    { id: "orders", label: "Orders" },
    { id: "account", label: "Account" },
  ];

  const renderTab = () => {
    switch (tab) {
      case "products":
        return <ProductsView onCartChange={refreshCart} />;
      case "cart":
        return <CartView onCartChange={refreshCart} />;
      case "orders":
        return <OrdersView />;
      case "account":
        return <AccountView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1 px-2">
          <button
            className="btn btn-ghost text-lg font-bold"
            onClick={() => setTab("products")}
          >
            Commerce Platform
          </button>
        </div>
        <div className="flex-none hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  className={tab === t.id ? "active" : ""}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                  {t.id === "cart" && cartCount > 0 && (
                    <span className="badge badge-sm badge-primary">
                      {cartCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile bottom tabs */}
      <div className="btm-nav md:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
            {t.id === "cart" && cartCount > 0 && (
              <span className="badge badge-sm badge-primary">{cartCount}</span>
            )}
          </button>
        ))}
      </div>

      <main className="p-4 pb-20 md:pb-4 max-w-5xl mx-auto">
        {error && <Alert type="error">{error}</Alert>}
        {renderTab()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
