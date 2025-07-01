import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { ApiService } from "../api";

export default function LobbyPage({ navigate }) {
  const { token, username, logout } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");

  async function loadLobby() {
    setLoading(true);
    try {
      setGames(await ApiService.getLobby(token));
      setErr("");
    } catch {
      setErr("Failed to load lobby.");
    }
    setLoading(false);
  }
  useEffect(() => { loadLobby(); }, []);

  async function handleCreate(vsAI) {
    setCreating(true);
    try {
      const { id } = await ApiService.createGame(token, vsAI);
      navigate("game/" + id);
    } catch {
      setErr("Create game failed.");
    }
    setCreating(false);
  }

  async function handleJoin(gameId) {
    try {
      await ApiService.joinGame(token, gameId);
      navigate("game/" + gameId);
    } catch {
      setErr("Join failed. Game may be full or already started.");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 600, margin: "48px auto" }}>
      <Header username={username} onLogout={logout} />
      <h2>Game Lobby</h2>
      <div style={{ display: "flex", gap: 8, margin: "18px 0" }}>
        <button className="btn" onClick={() => handleCreate(false)} disabled={creating}>
          New Game vs Player
        </button>
        <button className="btn" onClick={() => handleCreate(true)} disabled={creating}>
          New Game vs AI
        </button>
        <button className="btn" onClick={() => navigate("history")}>History</button>
        <button className="btn" onClick={() => navigate("stats")}>Stats</button>
      </div>
      {loading ? <div>Loading lobby...</div> :
        <GameList games={games} onJoin={handleJoin} you={username} />}
      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
    </div>
  );
}

function Header({ username, onLogout }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ fontWeight: "bold", fontSize: 18 }}>TicTacMaster</div>
      <div>
        <span style={{ marginRight: 12 }}>Hi, {username}</span>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

function GameList({ games, onJoin, you }) {
  if (!games?.length) return <div>No available games. Create one!</div>;
  return (
    <div>
      <table style={{ width: "100%", background: "var(--bg-primary)", borderCollapse: "collapse" }}>
        <thead style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          <tr>
            <th>Game ID</th>
            <th>Players</th>
            <th>Vs AI?</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td>{g.id}</td>
              <td>{g.players?.join(", ")}</td>
              <td>{g.vs_ai ? "Yes" : "No"}</td>
              <td>{g.status}</td>
              <td>
                {(g.status === "waiting" && (!g.players?.includes(you) || g.players?.length === 1)) ? (
                  <button className="btn" onClick={() => onJoin(g.id)}>Join</button>
                ) : (
                  <span style={{ color: "gray" }}>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
