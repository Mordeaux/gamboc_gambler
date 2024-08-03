import { PrismaClient, User } from "@prisma/client";
import MoveType from "@/app/_game/MoveType";
import { startingBalance } from "@/app/config";

const prisma = new PrismaClient();

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const rollDie = async (numberOfSides: number = 6) => {
  await sleep(3000);
  return Math.floor(Math.random() * numberOfSides) + 1;
};

export const getCurrentPlayer = async () =>
  prisma.user.findFirstOrThrow({
    where: { name: "Alice" },
  });

export const getLatestGameState = async (playerId: string) =>
  prisma.gameState.findFirstOrThrow({
    where: { playerId },
    orderBy: { createdAt: "desc" },
    include: {
      bet: true,
    },
    take: 1,
  });

export const processMove = async (
  currentPlayer: User,
  moveType: MoveType,
  betAmount?: number,
  betValue?: number,
) => {
  let gameState = null;
  switch (moveType) {
    case MoveType.Bet:
      if (!betAmount || !betValue) {
        throw new Error("Bet must be provided when moveType is Bet");
      }
      gameState = placeBet(currentPlayer, betAmount, betValue, await rollDie());
      break;
    case MoveType.Withdrawal:
      const gameStateCount = await prisma.gameState.count({
        where: { playerId: currentPlayer.id },
      });
      if (gameStateCount < 2) {
        gameState = getLatestGameState(currentPlayer.id);
        break;
      }
    case MoveType.StartGame:
    case MoveType.Bankruptcy:
      if (betAmount || betValue) {
        throw new Error("Bet must not be provided when moveType is not Bet");
      }
      gameState = resetGameState(currentPlayer, moveType);
      break;
    default:
      throw new Error("Invalid moveType");
  }
  return gameState;
};

const resetGameState = async (currentPlayer: User, moveType: MoveType) =>
  prisma.gameState.create({
    data: {
      balance: startingBalance,
      moveType,
      playerId: currentPlayer.id,
    },
  });

export const placeBet = async (
  currentPlayer: User,
  amount: number,
  value: number,
  rolledValue: number,
) => {
  const currentState = await getLatestGameState(currentPlayer.id);
  let balance = currentState.balance;
  if (amount > balance) {
    throw new Error("Bet amount is greater than balance");
  }

  if (value == rolledValue) {
    balance = balance + amount * 5;
  } else {
    balance = balance - amount;
  }

  await prisma.gameState.create({
    data: {
      balance,
      moveType: MoveType.Bet,
      playerId: currentState.playerId,
      bet: {
        create: { amount, value, rolledValue },
      },
    },
    include: { bet: true },
  });

  let newState = await getLatestGameState(currentPlayer.id);
  if (newState.balance == 0) {
    await processMove(currentPlayer, MoveType.Bankruptcy);
    return getLatestGameState(currentPlayer.id);
  } else {
    return newState;
  }
};
