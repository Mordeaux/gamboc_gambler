import { getCurrentPlayer, getLatestGameState } from "../_game";
import Bet from "./Bet";

export default async function Game() {
  const alice = await getCurrentPlayer();

  const currentGameState = await getLatestGameState(alice.id);
  const balance = currentGameState.balance;
  return (
    <>
      <h1 className="text-3xl font-bold underline">Game</h1>
      <Bet
        balance={balance}
        rolledValue={currentGameState.bet?.rolledValue || 0}
      />
    </>
  );
}
