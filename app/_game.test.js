import "@testing-library/jest-dom";
import { getCurrentPlayer, getLatestGameState, placeBet } from "./_game";
import MoveType from "@/app/_game/MoveType";
import { PrismaClient } from "@prisma/client";
import { startingBalance } from "@/app/config";
import { seed } from "@/prisma/seed";
import { processMove } from "../app/_game";

const prisma = new PrismaClient();

describe("_game", () => {
  beforeAll(async () => {
    await prisma.gameState.deleteMany();
  });

  beforeEach(async () => {
    await seed();
  });

  afterEach(async () => {
    await prisma.gameState.deleteMany();
  });

  afterAll(async () => {
    await seed();
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

  it("should bankrupt the player if they are out of funds", async () => {
    const currentPlayer = await getCurrentPlayer();
    const gameState = await placeBet(currentPlayer, 1000, 6, 3);
    expect(gameState.balance).toBe(startingBalance);
    expect(gameState.moveType).toBe(MoveType.Bankruptcy);
  });

  it("should withdraw if the player has won once", async () => {
    const currentPlayer = await getCurrentPlayer();
    await prisma.gameState.create({
      data: {
        balance: 1050,
        moveType: MoveType.Bet,
        playerId: currentPlayer.id,
        bet: {
          create: { amount: 10, value: 3, rolledValue: 3 },
        },
      },
    });
    const gameState = await processMove(currentPlayer, MoveType.Withdrawal);

    expect(gameState.balance).toBe(1000);
    expect(gameState.moveType).toBe(MoveType.Withdrawal);
  });

  it("should NOT withdraw if the player has NOT won", async () => {
    const currentPlayer = await getCurrentPlayer();
    await prisma.gameState.create({
      data: {
        balance: startingBalance - 10,
        moveType: MoveType.Bet,
        playerId: currentPlayer.id,
        bet: {
          create: { amount: 10, value: 2, rolledValue: 3 },
        },
      },
    });
    const gameState = await processMove(currentPlayer, MoveType.Withdrawal);

    expect(gameState.balance).toBe(startingBalance - 10);
    expect(gameState.moveType).toBe(MoveType.Bet);
  });

  it.each([[MoveType.Bankruptcy, startingBalance]])(
    "Should restart",
    async (moveType, expectedBalance) => {
      const currentPlayer = await getCurrentPlayer();
      const gameState = await processMove(currentPlayer, moveType);
      expect(gameState.balance).toBe(expectedBalance);
      expect(gameState.moveType).toBe(moveType);
    },
  );
});
