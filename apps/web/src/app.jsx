import { useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from "react-router";
import { AuthProvider, useAuth } from "./context/auth-context.jsx";
import { CartProvider, useCart } from "./context/cart-context.jsx";
import AuthView from "./views/auth-view.jsx";
import HomeView from "./views/home-view.jsx";
import ProductsView from "./views/products-view.jsx";
import CartView from "./views/cart-view.jsx";
import OrdersView from "./views/orders-view.jsx";
import OrderDetailView from "./views/order-detail-view.jsx";
import AccountView from "./views/account-view.jsx";

// Gated routes: guests are bounced to /login and returned via ?redirect=.
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading…</div>;
  }
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
}

function Shell() {
  const { user, logout } = useAuth();
  const { count, refresh } = useCart();

  useEffect(() => {
    refresh();
  }, [refresh, user]);

  const tabs = [
    { to: "/", label: "Home", end: true },
    { to: "/shop", label: "Shop" },
    { to: "/cart", label: "Cart" },
    ...(user
      ? [
          { to: "/orders", label: "Orders" },
          { to: "/account", label: "Account" },
        ]
      : []),
  ];

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1 px-2">
          <NavLink to="/" className="btn btn-ghost text-lg font-bold">
            Commerce Platform
          </NavLink>
        </div>
        <div className="flex-none hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {tabs.map((t) => (
              <li key={t.to}>
                <NavLink to={t.to} end={t.end}>
                  {t.label}
                  {t.to === "/cart" && count > 0 && (
                    <span className="badge badge-sm badge-primary">{count}</span>
                  )}
                </NavLink>
              </li>
            ))}
            {!user && (
              <li>
                <NavLink to="/login" className="btn btn-primary btn-sm">
                  Log in
                </NavLink>
              </li>
            )}
            {user && (
              <li>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile bottom tabs */}
      <div className="btm-nav md:hidden">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end}>
            <span>{t.label}</span>
            {t.to === "/cart" && count > 0 && (
              <span className="badge badge-sm badge-primary">{count}</span>
            )}
          </NavLink>
        ))}
      </div>

      <main className="p-4 pb-20 md:pb-4 max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/shop" element={<ProductsView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/login" element={<AuthView />} />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <OrdersView />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <RequireAuth>
                <OrderDetailView />
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <AccountView />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Shell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
