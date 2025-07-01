//
// Core API service layer to communicate with tic_tac_toe_backend REST API
//
// PUBLIC_INTERFACE
export class ApiService {
  /** Backend base URL (update as needed) */
  static BASE_URL = "http://localhost:3001"; // UPDATE if needed for deployment

  // PUBLIC_INTERFACE
  static async login(username, password) {
    /** Log in a user, return auth token or throw on fail */
    const res = await fetch(`${ApiService.BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json(); // {access_token: ...}
  }

  // PUBLIC_INTERFACE
  static async signup(username, password) {
    /** Register a new user. */
    const res = await fetch(`${ApiService.BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Signup failed");
    return res.json();
  }

  // PUBLIC_INTERFACE
  static async getLobby(token) {
    /** Get active game lobby (list of games) */
    const res = await fetch(`${ApiService.BASE_URL}/lobby`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load lobby");
    return res.json();
  }

  // PUBLIC_INTERFACE
  static async createGame(token, vsAI = false) {
    /** Create new game, vsAI = true/false */
    const res = await fetch(`${ApiService.BASE_URL}/games`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vsAI }),
    });
    if (!res.ok) throw new Error("Failed to create game");
    return res.json();
  }

  // PUBLIC_INTERFACE
  static async joinGame(token, gameId) {
    /** Join an existing game by ID */
    const res = await fetch(`${ApiService.BASE_URL}/games/${gameId}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to join game");
    return res.json();
  }

  // PUBLIC_INTERFACE
  static async getGameState(token, gameId) {
    /** Get the current state of a single game board */
    const res = await fetch(`${ApiService.BASE_URL}/games/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to get game state");
    return res.json();
  }

  // PUBLIC_INTERFACE
  static async playMove(token, gameId, cellIdx) {
    /** Play a move in the game. cellIdx = 0..8 for tictactoe */
    const res = await fetch(`${ApiService.BASE_URL}/games/${gameId}/move`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cell: cellIdx }),
    });
    if (!res.ok) throw new Error("Invalid move or not your turn");
    return res.json();
  }

  // PUBLIC_INTERFACE
  static async getHistory(token) {
    /** Get current user's past games */
    const res = await fetch(`${ApiService.BASE_URL}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load history");
    return res.json();
  }

  // PUBLIC_INTERFACE
  static async getStats(token) {
    /** Get user/player statistics */
    const res = await fetch(`${ApiService.BASE_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load stats");
    return res.json();
  }
}
