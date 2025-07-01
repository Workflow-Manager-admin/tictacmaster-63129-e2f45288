import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { ApiService } from "../api";

// PUBLIC_INTERFACE
export default function HistoryStatsPage({ tab, navigate }) {
  const { token, username, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      if (tab === "history") setHistory(await ApiService.getHistory(token));
      else setStats(await ApiService.getStats(token));
    } catch {
      setErr("Failed to load data.");
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, [tab]);

  return (
    <div className="container" style={{ maxWidth: 660, margin: "48px auto" }}>
      <Header username={username} onLogout={logout} navigate={navigate} />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className="btn" onClick={() => navigate("history")} style={tab === "history" ? { background: "var(--button-bg)", color: "var(--button-text)" } : {}}>History</button>
        <button className="btn" onClick={() => navigate("stats")} style={tab === "stats" ? { background: "var(--button-bg)", color: "var(--button-text)" } : {}}>Stats</button>
        <button className="btn" onClick={() => navigate("lobby")}>Lobby</button>
      </div>
      {loading ? <div>Loading...</div> : 
        tab === "history" ? <HistoryList items={history} you={username}/> : <StatsPanel stats={stats} />}
      {err && <div style={{ color: "crimson", marginTop: 7 }}>{err}</div>}
    </div>
  );
}

function Header({ username, onLogout, navigate }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ fontWeight: "bold", fontSize: 18, cursor: "pointer" }} onClick={() => navigate("lobby")}>TicTacMaster</div>
      <div>
        <span style={{ marginRight: 12 }}>Hi, {username}</span>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

function HistoryList({ items, you }) {
  if (!items?.length) return <div>No games played yet.</div>;
  return (
    <table style={{ width: "100%", marginTop: 16, background: "var(--bg-primary)", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Game ID</th>
          <th>Opponent</th>
          <th>Result</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {items.map((g) => (
          <tr key={g.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td>{g.id}</td>
            <td>{g.opponent}</td>
            <td>
              {g.result === "win" && <span style={{ color: "#43a047" }}>Win</span>}
              {g.result === "loss" && <span style={{ color: "crimson" }}>Loss</span>}
              {g.result === "draw" && <span style={{ color: "#aaa" }}>Draw</span>}
            </td>
            <td>{(new Date(g.completed_at)).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatsPanel({ stats }) {
  if (!stats) return <div>No stats available yet.</div>;
  return (
    <div style={{ marginTop: 24, fontSize: 18 }}>
      <div>Games Played: <b>{stats.played}</b></div>
      <div>Wins: <b style={{ color: "#43a047" }}>{stats.wins}</b></div>
      <div>Losses: <b style={{ color: "crimson" }}>{stats.losses}</b></div>
      <div>Draws: <b style={{ color: "#aaa" }}>{stats.draws}</b></div>
      <div>Win Rate: <b>{stats.win_rate}%</b></div>
    </div>
  );
}
