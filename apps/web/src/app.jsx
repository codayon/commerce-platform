import { useEffect, useState } from "react";
import { api } from "./lib/api.js";
import { AuthProvider, useAuth } from "./context/auth-context.jsx";
import AuthView from "./views/auth-view.jsx";
import ProductsView from "./views/products-view.jsx";
import CartView from "./views/cart-view.jsx";
import OrdersView from "./views/orders-view.jsx";
import AccountView from "./views/account-view.jsx";

function Shell() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("products");
  const [cartCount, setCartCount] = useState(0);
  // When a guest hits a gated action (checkout / account), show the auth
  // overlay instead of navigating away. After login the overlay closes.
  const [authOpen, setAuthOpen] = useState(false);

  async function refreshCart() {
    try {
      const res = await api.getCart();
      setCartCount((res.data.items || []).length);
    } catch {
      // silently ignore; cart requires auth and may be empty
    }
  }

  useEffect(() => {
    refreshCart();
  }, [user, tab]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading…</div>;
  }

  const tabs = [
    { id: "products", label: "Shop" },
    { id: "cart", label: "Cart" },
    { id: "orders", label: user ? "Orders" : null },
    { id: "account", label: user ? "Account" : null },
  ].filter((t) => t.label);

  // A gated tab is only reachable when logged in. For guests we open the
  // auth overlay so they can sign in / sign up to continue.
  function selectTab(id) {
    if (!user && (id === "orders" || id === "account")) {
      setAuthOpen(true);
      return;
    }
    setTab(id);
  }

  const renderTab = () => {
    switch (tab) {
      case "products":
        return <ProductsView key="products" onCartChange={refreshCart} />;
      case "cart":
        return (
          <CartView key="cart" onCartChange={refreshCart} onRequireAuth={() => setAuthOpen(true)} />
        );
      case "orders":
        return <OrdersView key="orders" />;
      case "account":
        return <AccountView key="account" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1 px-2">
          <button className="btn btn-ghost text-lg font-bold" onClick={() => selectTab("products")}>
            Commerce Platform
          </button>
        </div>
        <div className="flex-none hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  className={`tab-btn ${tab === t.id ? "tab-active" : ""}`}
                  onClick={() => selectTab(t.id)}
                >
                  {t.label}
                  {t.id === "cart" && cartCount > 0 && (
                    <span className="badge badge-sm badge-primary">{cartCount}</span>
                  )}
                </button>
              </li>
            ))}
            {!user && (
              <li>
                <button className="btn btn-primary btn-sm" onClick={() => setAuthOpen(true)}>
                  Log in
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile bottom tabs */}
      <div className="btm-nav md:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? "tab-active" : ""}`}
            onClick={() => selectTab(t.id)}
          >
            <span>{t.label}</span>
            {t.id === "cart" && cartCount > 0 && (
              <span className="badge badge-sm badge-primary">{cartCount}</span>
            )}
          </button>
        ))}
      </div>

      <main className="p-4 pb-20 md:pb-4 max-w-5xl mx-auto">{renderTab()}</main>

      {/* Auth overlay: guests browse freely; login is only required to
          checkout or view account/orders. */}
      {authOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="relative w-full max-w-md">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2 z-10"
              onClick={() => setAuthOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <AuthView
              onSuccess={() => {
                setAuthOpen(false);
                refreshCart();
              }}
            />
          </div>
        </div>
      )}
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
