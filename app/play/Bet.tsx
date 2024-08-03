"use client";
import React, { useState } from "react";
import BetSelector from "./BetSelector";
import MoveType from "@/app/_game/MoveType";

export default function Bet({ balance }: { balance: number }) {
  const [betAmount, setBetAmount] = useState(1);
  const [betValue, setBetValue] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(balance);

  const withdraw = () => {
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setBetValue(0);
    setBetAmount(1);
  };

  const submitBet = () => {
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
        <div>
          <input
            type="submit"
            value="Bet"
            onClick={submitBet}
            disabled={betValue == 0}
          />
        </div>
        <div>
          <input type="Withdraw" value="Withdraw" onClick={withdraw} />
        </div>
      </div>
    </div>
  );
}
