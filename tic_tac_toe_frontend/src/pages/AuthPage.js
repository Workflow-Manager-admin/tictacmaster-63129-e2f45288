import React, { useState } from "react";
import { ApiService } from "../api";
import { useAuth } from "../AuthContext";

// PUBLIC_INTERFACE
export default function AuthPage() {
  const [tab, setTab] = useState("login");
  return (
    <div style={{ maxWidth: 340, margin: "100px auto", padding: 32, background: "var(--bg-secondary)", borderRadius: 16, boxShadow: "0 2px 14px rgba(0,0,0,0.07)", minHeight: 320 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
        <button
          className="btn"
          style={tab === "login" ? { background: "var(--button-bg)", color: "var(--button-text)" } : { border: "1px solid var(--border-color)", background: "transparent" }}
          onClick={() => setTab("login")}
        >Login</button>
        <button
          className="btn"
          style={tab === "signup" ? { background: "var(--button-bg)", color: "var(--button-text)" } : { border: "1px solid var(--border-color)", background: "transparent" }}
          onClick={() => setTab("signup")}
        >Sign Up</button>
      </div>
      {tab === "login" ? <LoginForm /> : <SignupForm />}
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await ApiService.login(username, password);
      login(res.access_token, username);
    } catch {
      setErr("Login failed. Check credentials.");
    }
    setLoading(false);
  }
  return (
    <form onSubmit={onSubmit}>
      <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoFocus />
      <input className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button disabled={loading} className="btn" style={{ width: "100%", marginTop: 12 }}>{loading ? "Logging in..." : "Login"}</button>
      {err && <div style={{ color: "crimson", marginTop: 6 }}>{err}</div>}
    </form>
  );
}

function SignupForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await ApiService.signup(username, password);
      // Attempt login on successful signup
      const loginRes = await ApiService.login(username, password);
      login(loginRes.access_token, username);
    } catch {
      setErr("Signup failed. Try a different username.");
    }
    setLoading(false);
  }
  return (
    <form onSubmit={onSubmit}>
      <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoFocus />
      <input className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button disabled={loading} className="btn" style={{ width: "100%", marginTop: 12 }}>{loading ? "Signing up..." : "Sign Up"}</button>
      {err && <div style={{ color: "crimson", marginTop: 6 }}>{err}</div>}
    </form>
  );
}
