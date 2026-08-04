import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth-context.jsx";
import { Alert } from "../components/alert.jsx";

export default function AccountView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
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
