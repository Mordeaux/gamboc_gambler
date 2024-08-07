"use client";
import { useEffect, useState } from "react";
import Bet from "./Bet";
import { GameStateContext } from "@/app/_game/GameStateContext";
import GameHistoryType from "@/app/history/GameHistoryType";

export default function Game() {
  const [gameState, setGameState] = useState<GameHistoryType | null>(null);

  useEffect(() => {
    fetch("/api/play")
      .then((response) => response.json())
      .then((data) => {
        setGameState(data);
      });
  }, []);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      <h1 className="text-3xl font-bold text-center">Gamboc Gambler</h1>
      <Bet />
    </GameStateContext.Provider>
  );
}
