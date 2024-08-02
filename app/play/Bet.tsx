"use client";
import React, { useState } from "react";
import BetSelector from "./BetSelector";

export default function Bet({ balance }: { balance: number }) {
  const [betAmount, setBetAmount] = useState(1);
  const [betValue, setBetValue] = useState(0);

  const submitBet = () => {
    console.log("betAmount", betAmount);
    console.log("betValue", betValue);
  };

  return (
    <div>
      <div>
        <input
          type="number"
          placeholder="Bet amount"
          value={betAmount}
          min={1}
          max={balance}
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
        <div>
          {Array.from({ length: 6 }, (_, i) => (
            <BetSelector dieSide={i + 1} key={i} setBetValue={setBetValue} />
          ))}
        </div>
        <input
          type="submit"
          value="Bet"
          onClick={submitBet}
          disabled={betValue == 0}
        />
      </div>
    </div>
  );
}
