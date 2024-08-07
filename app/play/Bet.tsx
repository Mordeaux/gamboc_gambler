"use client";
import React, { useState } from "react";
import BetSelector from "@/app/play/BetSelector";
import MoveType from "@/app/_game/MoveType";
import { useGameState } from "@/app/_game/GameStateContext";

export default function Bet() {
  const { gameState, setGameState } = useGameState();
  const [betAmount, setBetAmount] = useState(gameState?.betAmount || 1);
  const [betValue, setBetValue] = useState(gameState?.betValue || 0);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [displayHistory, setDisplayHistory] = useState(false);
  const [lastRolledValue, setLastRolledValue] = useState(
    gameState?.rollValue || 0,
  );
  const [lastBetValue, setLastBetValue] = useState(0);

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
        setBetValue(1);
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
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div>Balance: {gameState?.balance}</div>
      <div>
        <input
          type="number"
          placeholder="Bet amount"
          min={1}
          max={gameState?.balance}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              setBetAmount(parseInt(e.target.value));
            } else {
              console.error(`Invalid bet amount ${value}`);
              setBetAmount(betAmount);
            }
          }}
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
        <div>
          <input
            type="submit"
            defaultValue="Bet"
            onClick={submitBet}
            disabled={betValue == 0 || awaitingResponse}
          />
        </div>
        <div>
          <input
            type="Withdraw"
            defaultValue="Withdraw"
            onClick={withdraw}
            disabled={awaitingResponse}
          />
        </div>
      </div>
    </>
  );
}
