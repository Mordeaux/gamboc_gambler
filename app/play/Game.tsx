import React, { useState } from "react";
import Bet from "./Bet";

export default function Game() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Game</h1>
        <div>Balance: 1000</div>
        <Bet />
      </div>
    </main>
  );
}
