import { useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Alert } from "../components/Alert.jsx";

export default function AccountView() {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");
  const [bye, setBye] = useState(false);

  async function handleLogout() {
    setError("");
    try {
      await api.logout();
      logout();
      setBye(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (bye) {
    return <Alert type="success">You have been logged out. See you soon!</Alert>;
  }

  return (
    <div className="mx-auto max-w-md card bg-base-100 shadow-sm p-6 text-center">
      <h2 className="text-xl font-semibold mb-2">Your account</h2>
      {error && <Alert type="error">{error}</Alert>}
      <p className="opacity-70">
        {user?.email ? `Signed in as ${user.email}` : "You are signed in."}
      </p>
      <button className="btn btn-outline btn-error mt-4" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
