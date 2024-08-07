"use client";
import { useEffect, useState } from "react";
import History from "@/app/history/History";
import GameHistoryType from "@/app/history/GameHistoryType";
import { GameStateContext } from "./_game/GameStateContext";
import Play from "@/app/play/Play";
import { HistoryContext } from "./history/HistoryContext";

export default function Home() {
  const [displayHistory, setDisplayHistory] = useState(false);
  const [gameState, setGameState] = useState<GameHistoryType | null>(null);
  const [history, setHistory] = useState<GameHistoryType[][]>([]);

  useEffect(() => {
    fetch("/api/play")
      .then((response) => response.json())
      .then((data) => {
        setGameState(data);
      });
  }, []);

  useEffect(() => {
    fetch("api/history")
      .then((resp) => resp.json())
      .then(({ history }) => {
        setHistory(history);
      });
  }, [gameState]);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      <HistoryContext.Provider value={history}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="border-solid border-8 border-c4/60 rounded-2xl w-full p-10 bg-c3">
            <h1 className="text-3xl font-bold text-center">Gomboc Gambler</h1>
            <Play />
            <button
              className="bg-c2 font-semibold py-2 px-4 border border-c2 rounded m-10"
              onClick={() => setDisplayHistory(!displayHistory)}
            >
              {displayHistory ? "Hide" : "See"} History
            </button>
          </div>
          {displayHistory && (
            <div className="border-solid border-8 border-c4/60 rounded-2xl w-full p-10 bg-c3 m-2 min-h-screen">
              <h1 className="text-3xl font-bold text-center">History</h1>
              <History />
            </div>
          )}
        </main>
      </HistoryContext.Provider>
    </GameStateContext.Provider>
  );
}
