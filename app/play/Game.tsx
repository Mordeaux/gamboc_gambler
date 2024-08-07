"use client";
import { getCurrentPlayer, getLatestGameState } from "../_game";
import Bet from "./Bet";
import GameContext from "@/app/_game/GameContext";

export default function Game() {
  const alice = await getCurrentPlayer();

  const currentGameState = await getLatestGameState(alice.id);
  const balance = currentGameState.balance;
  return (
    <GameContext.Provider value={{}}>
      <h1 className="text-3xl font-bold text-center">Gamboc Gambler</h1>
      <Bet
        balance={balance}
        rolledValue={currentGameState.bet?.rolledValue || 0}
      />
    </GameContext.Provider>
  );
}
