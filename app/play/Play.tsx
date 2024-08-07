"use client";
import React, { useState } from "react";
import BetSelector from "@/app/play/BetSelector";
import MoveType from "@/app/_game/MoveType";
import { useGameState } from "@/app/_game/GameStateContext";
import Bet from "./Bet";
import { useHistory } from "../history/HistoryContext";

export default function Play() {
  const { gameState, setGameState } = useGameState();
  const history = useHistory();
  const [betAmount, setBetAmount] = useState(gameState?.betAmount || 1);
  const [betValue, setBetValue] = useState(gameState?.betValue || 0);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [displayHistory, setDisplayHistory] = useState(false);
  const [lastRolledValue, setLastRolledValue] = useState(
    gameState?.rollValue || 0,
  );
  const [lastBetValue, setLastBetValue] = useState(0);
  const hasPreviouslyBet = history.slice(-1)[0]?.length > 0;

  const withdraw = () => {
    setAwaitingResponse(true);
    setDisplayHistory(false);
    setLastBetValue(0);
    fetch("/api/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moveType: MoveType.Withdrawal }),
    })
      .then((response) => response.json())
      .then((data) => {
        setBetValue(0);
        setBetAmount(1);
        setAwaitingResponse(false);
        setLastRolledValue(0);
        setGameState(data.newGameState);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const submitBet = () => {
    setAwaitingResponse(true);
    setLastBetValue(betValue);
    fetch("/api/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moveType: MoveType.Bet, betAmount, betValue }),
    })
      .then((response) => response.json())
      .then((data) => {
        setAwaitingResponse(false);
        setDisplayHistory(true);
        setLastRolledValue(data.newGameState.bet.rolledValue);
        setGameState(data.newGameState);
        setTimeout(() => {
          setDisplayHistory(false);
        }, 3000);
      })
      .catch((error) => {
        setAwaitingResponse(false);
        console.error("Error:", error);
      });
  };

  return (
    <>
      <h2 className="text-xl font-bold text-center m-2">
        Balance: {gameState?.balance}:
      </h2>

      <Bet
        balance={gameState?.balance!}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
      />
      <div className="flex">
        {Array.from({ length: 6 }, (_, i) => (
          <BetSelector
            dieSide={i + 1}
            key={i}
            setBetValue={setBetValue}
            betValue={betValue}
          />
        ))}
      </div>
      <div>{awaitingResponse ? "Rolling Die" : ""}</div>
      <div>
        {displayHistory && lastRolledValue
          ? `You rolled a ${lastRolledValue}, ${lastRolledValue === lastBetValue ? "You win!" : "You lose!"}`
          : ""}
      </div>
      <div className="flex">
        <button
          className="bg-c2 disabled:bg-c1 font-semibold py-2 px-4 border border-c1 rounded m-10"
          onClick={submitBet}
          disabled={
            betValue == 0 ||
            awaitingResponse ||
            !!(gameState?.balance && betAmount > gameState?.balance)
          }
        >
          Place Bet
        </button>
        <button
          className="bg-c2 disabled:bg-c1 font-semibold py-2 px-4 border border-c1 rounded m-10"
          onClick={withdraw}
          disabled={awaitingResponse || !hasPreviouslyBet}
        >
          Withdraw Balance
        </button>
      </div>
    </>
  );
}
