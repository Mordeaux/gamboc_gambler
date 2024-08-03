"use client";
import Image from "next/image";
import MoveType from "@/app/_game/MoveType";
import GameHistoryType from "@/app/history/GameHistoryType";
import { useEffect, useState } from "react";

enum DieColor {
  White = "white",
  Black = "black",
}

const getHistory = async () => {
  const response = await fetch(`api/history`);
  return await response.json();
};

const Die = ({ dieSide, color }: { dieSide: number; color: DieColor }) => (
  <Image
    src={`${color}-dice/dice-${dieSide}-svgrepo-com.svg`}
    alt={dieSide.toString()}
    height={50}
    width={50}
  />
);

const formatDateTime = (date: Date) => {
  const getOrdinal = (n: number) => {
    const finalDigit = n % 10;
    switch (finalDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `On ${dayOfWeek}, the ${day}${getOrdinal(day)} of ${month}, ${year} at ${hour}:${minute}:${second}`;
};

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

  useEffect(() => {
    getHistory().then(({ history }) => {
      setHistory(history);
    });
  }, []);

  return (
    <div>
      {history.map((game, i) => {
        return (
          <div key={i}>
            <h1>Game {i + 1}:</h1>
            <GameHistory game={game} />
          </div>
        );
      })}
    </div>
  );
}
