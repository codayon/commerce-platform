import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, isVerified, role } or null
  const [loading, setLoading] = useState(true);

  // On mount, ask the API whether we already have a session.
  useEffect(() => {
    api
      .getProfile()
      .then(() => setUser({ isVerified: true }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    await api.login(email, password);
    setUser({ isVerified: true, email });
  }

  async function logout() {
    await api.logout();
    setUser(null);
  }

  // Used by signup flow: we don't set user until email is verified.
  function markVerified(email) {
    setUser({ isVerified: true, email });
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, markVerified, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
