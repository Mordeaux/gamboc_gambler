import { getCurrentPlayer, getLatestGameState } from "../_game";
import Bet from "./Bet";
import Link from "next/link";

export default async function Game() {
  const alice = await getCurrentPlayer();

  const currentGameState = await getLatestGameState(alice.id);
  const balance = currentGameState.balance;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-3xl font-bold underline">Game</h1>
        <Bet balance={balance} />
        <h1 className="text-3xl font-bold underline">
          <Link href="history">See History</Link>
        </h1>
      </div>
    </main>
  );
}
