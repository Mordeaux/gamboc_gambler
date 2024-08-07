"use client";
import GameHistoryType from "@/app/history/GameHistoryType";
import { useEffect, useState } from "react";
import { HistoryContext } from "./HistoryContext";
import { useGameState } from "../_game/GameStateContext";
import { startingBalance } from "../config";
import BetHistory from "@/app/history/BetHistory";

const GameHistoryBorder = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center border-solid border-8 border-c2 rounded-2xl w-3/4 p-10 bg-c1 m-2 mx-auto">
    {children}
  </div>
);

export default function History() {
  const [history, setHistory] = useState<GameHistoryType[][]>([]);
  const { gameState } = useGameState();

  useEffect(() => {
    fetch("api/history")
      .then((resp) => resp.json())
      .then(({ history }) => {
        setHistory(history);
      });
  }, [gameState]);

  return (
    <HistoryContext.Provider value={history}>
      {history.map((game, i) => {
        return (
          <div key={i} className="p-4">
            <h2 className="text-xl font-bold text-center">Game {i + 1}:</h2>
            {game.map((gameState, j) => (
              <GameHistoryBorder key={`${i}${j}`}>
                <BetHistory
                  gameState={gameState}
                  previousBalance={game[j - 1]?.balance || startingBalance}
                />
              </GameHistoryBorder>
            ))}
          </div>
        );
      })}
    </HistoryContext.Provider>
  );
}
