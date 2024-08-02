import { PrismaClient } from "@prisma/client";
import { getLatestGameState } from "../_game";
import Bet from "./Bet";

const prisma = new PrismaClient();

export default async function Game() {
  const alice = await prisma.user.findFirstOrThrow({
    where: { name: "Alice" },
  });
  const currentGameState = await getLatestGameState(alice.id);
  const balance = currentGameState.balance;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Game</h1>
        <Bet balance={balance} />
      </div>
    </main>
  );
}
