import "@testing-library/jest-dom";
import { getCurrentPlayer, placeBet } from "./_game";
import MoveType from "@/app/_game/MoveType";
import { PrismaClient } from "@prisma/client";
import { startingBalance } from "@/app/config";
import { seed } from "@/prisma/seed";
import { processMove } from "../app/_game";

const prisma = new PrismaClient();

describe("_game", () => {
  beforeEach(async () => {
    await seed();
  });

  afterEach(async () => {
    await prisma.gameState.deleteMany();
  });

  it.each([
    [2, 3, 3, 1010],
    [2, 1, 3, 998],
    [900, 5, 5, 5500],
    [100, 3, 5, 900],
  ])(
    "should accept bets and payout accordingly",
    async (betAmount, betValue, rolledValue, expectedBalance) => {
      const currentPlayer = await getCurrentPlayer();
      const gameState = await placeBet(
        currentPlayer,
        betAmount,
        betValue,
        rolledValue,
      );
      expect(gameState.balance).toBe(expectedBalance);
      expect(gameState.moveType).toBe(MoveType.Bet);
    },
  );

  it.each([
    [MoveType.Bankruptcy, startingBalance],
    [MoveType.Withdrawal, startingBalance],
  ])("Should restart", async (moveType, expectedBalance) => {
    const currentPlayer = await getCurrentPlayer();
    const gameState = await processMove(currentPlayer, moveType);
    expect(gameState.balance).toBe(expectedBalance);
    expect(gameState.moveType).toBe(moveType);
  });
});