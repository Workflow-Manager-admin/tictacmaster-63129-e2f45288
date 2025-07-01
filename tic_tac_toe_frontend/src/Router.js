import React from "react";
import { useAuth } from "./AuthContext";
import AuthPage from "./pages/AuthPage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import HistoryStatsPage from "./pages/HistoryStatsPage";

export default function Router() {
  const { token } = useAuth();
  const [route, setRoute] = React.useState(window.location.hash.replace("#", "") || "lobby");
  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace("#", "") || "lobby");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (!token) {
    return <AuthPage />;
  }

  let PageComponent = null;
  if (route.startsWith("lobby")) PageComponent = <LobbyPage navigate={nav} />;
  else if (route.startsWith("game/")) PageComponent = <GamePage id={route.split("/")[1]} navigate={nav} />;
  else if (route === "history") PageComponent = <HistoryStatsPage tab="history" navigate={nav} />;
  else if (route === "stats") PageComponent = <HistoryStatsPage tab="stats" navigate={nav} />;
  else PageComponent = <LobbyPage navigate={nav} />;

  function nav(path) {
    window.location.hash = "#" + path;
  }

  return PageComponent;
}
