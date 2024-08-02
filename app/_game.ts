import { Prisma, GameState, Bet, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type BetWithRolledValueOptional = Optional<Bet, "rolledValue">;
type BetPartial = Pick<
  BetWithRolledValueOptional,
  "betAmount" | "betValue" | "rolledValue"
>;

const rollDie = (numberOfSides: number = 6) => {
  return Math.floor(Math.random() * numberOfSides) + 1;
};

export const getLatestGameState = async (playerId: string) => {
  const gameStates = await prisma.gameState.findFirstOrThrow({
    where: { playerId },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  return gameStates;
};

export enum MoveType {
  StartGame = "StartGame",
  Bet = "Bet",
  Bankruptcy = "Bankruptcy",
  Withdrawal = "Withdrawal",
}

export const createNextGameState = async (
  currentState: GameState,
  moveType: MoveType,
  bet: BetPartial | null = null,
) => {
  let balance = currentState.balance;

  switch (moveType) {
    case MoveType.Bet:
      if (!bet) {
        throw new Error("Bet must be provided when moveType is Bet");
      } else if (bet.betAmount > balance) {
        throw new Error("Bet amount is greater than balance");
      }
      bet.rolledValue = rollDie();

      if (bet.betValue == bet.rolledValue) {
        balance = balance + bet.betAmount * 5;
      } else {
        balance = balance - bet.betAmount;
      }
      break;
    case MoveType.StartGame:
    case MoveType.Bankruptcy:
    case MoveType.Withdrawal:
      if (bet) {
        throw new Error("Bet must not be provided when moveType is not Bet");
      }
      balance = 1000;
      break;
    default:
      throw new Error("Invalid moveType");
  }

  return await prisma.gameState.create({
    data: {
      balance,
      moveType,
      playerId: currentState.playerId,
      // Normal bounds checking didn't work for rolledValue for some reason
      bet: bet
        ? { create: { ...bet, rolledValue: bet.rolledValue || 0 } }
        : undefined,
    },
    include: { bet: true },
  });
};
