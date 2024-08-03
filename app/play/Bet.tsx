"use client";
import React, { useState } from "react";
import BetSelector from "./BetSelector";
import MoveType from "@/app/_game/MoveType";

export default function Bet({
  balance,
  rolledValue,
}: {
  balance: number;
  rolledValue: number;
}) {
  const [betAmount, setBetAmount] = useState(1);
  const [betValue, setBetValue] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(balance);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [displayHistory, setDisplayHistory] = useState(false);
  const [lastRolledValue, setLastRolledValue] = useState(rolledValue);
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
        setCurrentBalance(data.newGameState.balance);
        setBetValue(0);
        setBetAmount(1);
        setAwaitingResponse(false);
        setLastRolledValue(0);
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
        setCurrentBalance(data.newGameState.balance);
        setAwaitingResponse(false);
        setDisplayHistory(true);
        setLastRolledValue(data.newGameState.bet.rolledValue);
        setTimeout(() => {
          setDisplayHistory(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div>Balance: {currentBalance}</div>
      <div>
        <input
          type="number"
          placeholder="Bet amount"
          value={betAmount}
          min={1}
          max={currentBalance}
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
            value="Bet"
            onClick={submitBet}
            disabled={betValue == 0 || awaitingResponse}
          />
        </div>
        <div>
          <input
            type="Withdraw"
            value="Withdraw"
            onClick={withdraw}
            disabled={awaitingResponse}
          />
        </div>
      </div>
    </div>
  );
}
