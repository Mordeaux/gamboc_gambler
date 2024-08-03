import { PrismaClient } from "@prisma/client";
import { startingBalance } from "../app/config";

const prisma = new PrismaClient();

const initialUser = {
  name: "Alice",
};

const createInitialUser = async () => {
  let alice = await prisma.user.findFirst({
    where: { name: "Alice" },
  });
  if (!alice) {
    alice = await prisma.user.create({
      data: initialUser,
    });
  }
  return alice;
};

export const seed = async (balance: number = startingBalance) => {
  const alice = await createInitialUser();

  const gameStates = await prisma.gameState.findMany({
    where: { playerId: alice.id },
  });
  if (gameStates.length === 0) {
    await prisma.gameState.create({
      data: {
        balance: balance,
        moveType: "StartGame",
        playerId: alice.id,
      },
    });
  }
};

seed();
