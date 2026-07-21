import { useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Alert } from "../components/Alert.jsx";

export default function AuthView() {
  const { login, markVerified } = useAuth();
  const [mode, setMode] = useState("login"); // login | signup | verify
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      await api.signup(username, email, password);
      setMode("verify");
      setInfo("We sent a code to your email. Enter it below to verify.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.verifyOtp(email, otp);
      markVerified(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await api.resendOtp(email);
      setInfo("A new code has been sent to your email.");
    } catch (err) {
      setError(err.message);
    }
  }

  const inputCls = "input input-bordered w-full";

  if (mode === "verify") {
    return (
      <div className="mx-auto max-w-md card bg-base-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-2">Verify your email</h2>
        {error && <Alert type="error">{error}</Alert>}
        {info && <Alert type="info">{info}</Alert>}
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="form-control">
            <span className="label-text">Email</span>
            <input
              className={inputCls}
              type="email"
              value={email}
              disabled
            />
          </label>
          <label className="form-control">
            <span className="label-text">Verification code</span>
            <input
              className={inputCls}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              required
            />
          </label>
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Verifying…" : "Verify"}
          </button>
        </form>
        <button className="btn btn-link btn-sm mt-2" onClick={handleResend}>
          Resend code
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md card bg-base-100 shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-2">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h2>
      {error && <Alert type="error">{error}</Alert>}
      {info && <Alert type="info">{info}</Alert>}
      <form
        onSubmit={mode === "login" ? handleLogin : handleSignup}
        className="space-y-3"
      >
        {mode === "signup" && (
          <label className="form-control">
            <span className="label-text">Username</span>
            <input
              className={inputCls}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        )}
        <label className="form-control">
          <span className="label-text">Email</span>
          <input
            className={inputCls}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Password</span>
          <input
            className={inputCls}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : "Sign up"}
        </button>
      </form>
      <div className="mt-3 text-center text-sm">
        {mode === "login" ? (
          <button
            className="btn btn-link btn-sm"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Need an account? Sign up
          </button>
        ) : (
          <button
            className="btn btn-link btn-sm"
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Already registered? Log in
          </button>
        )}
      </div>
    </div>
  );
}
