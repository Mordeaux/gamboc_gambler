"use client";
import React, { useState } from "react";

export default function Bet() {
  const [bet, setBet] = useState(0);
  return (
    <div>
      <h1>Bet</h1>
      <div>
        <input
          type="number"
          placeholder="Bet amount"
          value={bet}
          min={1}
          onChange={(e) => {
            console.log("running");
            setBet(parseInt(e.target.value));
          }}
        />
        <div>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
        </div>
        <input type="submit" value="Bet" />
      </div>
    </div>
  );
}
