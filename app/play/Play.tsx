"use client";
import React, { useState } from "react";
import BetSelector from "@/app/play/BetSelector";
import MoveType from "@/app/_game/MoveType";
import { useGameState } from "@/app/_game/GameStateContext";
import Bet from "./Bet";
import { useHistory } from "../history/HistoryContext";
import Die, { DieColor } from "../history/Die";
import { hasWon } from "../utils";

const RollingDie = () => {
  const [side, setSide] = useState(1);
  setInterval(() => {
    setSide((side) => (side % 6) + 1);
  }, 100);
  return <Die dieSide={side} color={DieColor.Black} />;
};

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
  const hasPreviouslyWon = hasWon(history);

  const [lastBetAmount, setLastBetAmount] = useState(0);
  const potentialWinnings = lastBetAmount * 5;

  const withdraw = () => {
    setAwaitingResponse(true);
    setDisplayHistory(false);
    setLastBetValue(0);
    setLastBetAmount(0);

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
        setLastRolledValue(0);
        setAwaitingResponse(false);
        setGameState(data.newGameState);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const submitBet = () => {
    setAwaitingResponse(true);
    setLastBetValue(betValue);
    setLastBetAmount(betAmount);
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
        setLastRolledValue(
          data.newGameState.bet?.rolledValue ||
            history.slice(-2)[0]?.slice(-2)[0]?.betValue ||
            0,
        );
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
        Balance: {gameState?.balance}
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
      <div className="flex">
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
            disabled={awaitingResponse || !hasPreviouslyWon}
          >
            Withdraw Balance
          </button>
        </div>
        <div className="m-auto">
          {awaitingResponse ? <RollingDie /> : ""}
          {displayHistory ? (
            <>
              <Die dieSide={lastRolledValue} color={DieColor.Black} />
              {lastRolledValue === lastBetValue
                ? `You win ${potentialWinnings} chip${potentialWinnings > 1 ? "s" : ""}!`
                : `You lose ${lastBetAmount} chip${lastBetAmount && lastBetAmount > 1 ? "s" : ""}!`}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
