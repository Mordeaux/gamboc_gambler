"use client";
import { useEffect, useState } from "react";
import History from "@/app/history/History";
import GameHistoryType from "@/app/history/GameHistoryType";
import { GameStateContext } from "./_game/GameStateContext";
import Bet from "@/app/play/Bet";

export default function Home() {
  const [displayHistory, setDisplayHistory] = useState(false);
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
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="border-solid border-8 border-c4/60 rounded-2xl w-full p-10 bg-c3">
          <h1 className="text-3xl font-bold text-center">Gamboc Gambler</h1>
          <Bet />
          <button
            className="bg-c1 font-semibold py-2 px-4 border border-c2 rounded m-10"
            onClick={(e) => {
              e.preventDefault();
              console.log("displayHistory", displayHistory);
              setDisplayHistory(!displayHistory);
            }}
          >
            See History
          </button>
        </div>
        {displayHistory && (
          <div className="border-solid border-8 border-c4/60 rounded-2xl w-full p-10 bg-c3 m-2 min-h-screen">
            <h1 className="text-3xl font-bold text-center">History</h1>
            <History />
          </div>
        )}
      </main>
    </GameStateContext.Provider>
  );
}
