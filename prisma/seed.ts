import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialUser = {
  name: "Alice",
};

const seed = async () => {
  const alice = await prisma.user.findFirst({
    where: { name: initialUser.name },
  });
  if (!alice) {
    await prisma.user.create({
      data: initialUser,
    });
  }
  const aliceRefresh = await prisma.user.findFirst({
    where: { name: initialUser.name },
  });
  if (aliceRefresh === null) throw new Error("Alice not found");

  const gameStates = await prisma.gameState.findMany({
    where: { playerId: aliceRefresh.id },
  });
  if (gameStates.length === 0) {
    await prisma.gameState.create({
      data: {
        balance: 1000,
        moveType: "StartGame",
        playerId: aliceRefresh.id,
      },
    });
  }
};

seed();
