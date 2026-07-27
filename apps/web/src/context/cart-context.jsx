import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "./auth-context.jsx";

const CartContext = createContext(null);

// Shared cart state so any view (navbar badge, products, cart) can read and
// refresh the same count without prop drilling.
export function CartProvider({ children }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await api.getCart();
      setCount((res.data.items || []).length);
    } catch {
      // cart requires auth / may be empty; ignore
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [user, refresh]);

  return <CartContext.Provider value={{ count, refresh }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
