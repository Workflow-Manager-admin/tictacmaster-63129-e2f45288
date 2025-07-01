import React, { useState, useEffect } from "react";
import "./App.css";
import { AuthProvider } from "./AuthContext";
import Router from "./Router";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{ position: "fixed", top: 18, right: 16, zIndex: 999 }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </div>
  );
}

export default App;
