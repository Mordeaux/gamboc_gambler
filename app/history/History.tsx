"use client";
import Image from "next/image";
import MoveType from "@/app/_game/MoveType";
import GameHistoryType from "@/app/history/GameHistoryType";
import { useEffect, useState } from "react";
import { HistoryContext } from "./HistoryContext";
import { useGameState } from "../_game/GameStateContext";
import { formatDateTime } from "../utils";

enum DieColor {
  White = "white",
  Black = "black",
}

const Die = ({ dieSide, color }: { dieSide: number; color: DieColor }) => (
  <Image
    src={`${color}-dice/dice-${dieSide}-svgrepo-com.svg`}
    alt={dieSide.toString()}
    height={50}
    width={50}
  />
);

const GameHistory = ({ game }: { game: GameHistoryType[] }) => {
  let previousBalance;
  const children = game.map((gameState, i) => {
    if (gameState.moveType === MoveType.Withdrawal) {
      return <p key={i}>You withdrew: {previousBalance!}</p>;
    } else if (gameState.moveType === MoveType.Bankruptcy) {
      return <p key={i}>You went bankrupt. Please seek help</p>;
    } else if (
      gameState.betAmount &&
      gameState.betValue &&
      gameState.rollValue
    ) {
      previousBalance = gameState.balance;

      return (
        <div key={i}>
          <p>
            {formatDateTime(new Date(gameState.createdAt))}:<br />
            You bet {gameState.betAmount} chip
            {gameState.betAmount > 1 ? "s" : ""} on:{" "}
            <Die dieSide={gameState.betValue} color={DieColor.Black} />
          </p>
          <p>
            You rolled:
            <Die dieSide={gameState.rollValue} color={DieColor.White} />
          </p>
          <p>Balance: {gameState.balance}</p>
          <br />
          <br />
        </div>
      );
    }
  });
  return children;
};

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
          <div key={i}>
            <h1>Game {i + 1}:</h1>
            <GameHistory game={game} />
          </div>
        );
      })}
    </HistoryContext.Provider>
  );
}
