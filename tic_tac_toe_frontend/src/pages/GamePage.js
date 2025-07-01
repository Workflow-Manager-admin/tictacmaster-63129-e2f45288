import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { ApiService } from "../api";

export default function GamePage({ id, navigate }) {
  const { token, username, logout } = useAuth();
  const [game, setGame] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [moveLoading, setMoveLoading] = useState(false);

  async function fetchGame() {
    setLoading(true);
    try {
      setGame(await ApiService.getGameState(token, id));
      setErr("");
    } catch {
      setErr("Failed to load game.");
    }
    setLoading(false);
  }

  useEffect(() => { fetchGame(); }, [id]);

  async function playMove(idx) {
    setMoveLoading(true);
    try {
      await ApiService.playMove(token, id, idx);
      await fetchGame();
      setErr("");
    } catch {
      setErr("Invalid move or not your turn!");
    }
    setMoveLoading(false);
  }

  if (loading) return <div className="container" style={{ margin: "70px auto" }}>Loading game...</div>;
  if (!game) return <div className="container" style={{ margin: "70px auto" }}>Game not found.</div>;

  return (
    <div className="container" style={{ maxWidth: 500, margin: "48px auto" }}>
      <Header username={username} onLogout={logout} navigate={navigate} />
      <h2>Tic Tac Toe</h2>
      <div style={{ fontWeight: "bold" }}>
        Game vs {game.vs_ai ? "AI" : "Player(s)"}
        <span style={{ marginLeft: 18, color: "#777" }}>({game.status})</span>
      </div>
      <Board 
        board={game.board} 
        onMove={idx => playMove(idx)} 
        playerSymbol={game.player_symbol}
        currentTurn={game.turn}
        status={game.status}
        finished={!!game.winner || game.status === "finished"}
        moveLoading={moveLoading}
      />
      {game.winner && (
        <div style={{ margin: "10px 0", fontWeight: "bold", color: "#43a047" }}>
          Winner: {game.winner === "draw" ? "It's a draw!" : game.winner}
        </div>
      )}
      <button className="btn" onClick={() => navigate("lobby")} style={{ marginTop: 20 }}>Back to Lobby</button>
      {err && <div style={{ color: "crimson", marginTop: 6 }}>{err}</div>}
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

function Board({ board = [], onMove, playerSymbol, currentTurn, status, finished, moveLoading }) {
  // board = ["X", "", "", ...] 9 items
  return (
    <div style={{ width: 240, height: 240, display: "flex", flexWrap: "wrap", margin: "30px auto", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 8, background: "var(--bg-secondary)", }}>
      {board.map((cell, idx) => (
        <Cell 
          key={idx} 
          value={cell} 
          onClick={() => !cell && !finished && !moveLoading && currentTurn === playerSymbol && onMove(idx)} 
          current={currentTurn === playerSymbol && !cell && !finished}
        />
      ))}
    </div>
  );
}

function Cell({ value, onClick, current }) {
  return (
    <div onClick={onClick} style={{
      width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 36, border: "1px solid var(--border-color)", cursor: current ? "pointer" : "default",
      background: current ? "rgba(129,199,132,0.07)" : "transparent", transition: "background 0.15s"
    }}>
      {value}
    </div>
  );
}
