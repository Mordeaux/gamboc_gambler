import Image from "next/image";
import { getCurrentPlayer } from "../_game";
import { GameHistory, getHistory } from "./getHistory";
import MoveType from "../_game/MoveType";

enum DieColor {
  White = "white",
  Black = "black",
}

const Die = ({ dieSide, color }: { dieSide: number; color: DieColor }) => (
  <Image
    src={`${color}-dice/dice-${dieSide}-svgrepo-com.svg`}
    alt={dieSide.toString()}
    height={50}
    width={50}
  />
);

const GameHistory = ({ game }: { game: GameHistory[] }) => {
  let previousBalance;
  const children = game.map((gameState) => {
    if (gameState.moveType === MoveType.Withdrawal) {
      return <p>You withdrew: {previousBalance!}</p>;
    } else if (gameState.moveType === MoveType.Bankruptcy) {
      return <p>You went bankrupt. Please seek help</p>;
    } else if (
      gameState.betAmount &&
      gameState.betValue &&
      gameState.rollValue
    ) {
      previousBalance = gameState.balance;

      return (
        <div>
          <p>
            You bet {gameState.betAmount} chip
            {gameState.betAmount > 1 ? "s" : ""} on:{" "}
            <Die dieSide={gameState.betValue} color={DieColor.Black} />
          </p>
          <p>
            You rolled:
            <Die dieSide={gameState.rollValue} color={DieColor.White} />
          </p>
          <p>Balance: {gameState.balance}</p>
          <br />
          <br />
        </div>
      );
    }
  });
  return children;
};

export default async function History() {
  const currentPlayer = await getCurrentPlayer();
  const history = await getHistory(currentPlayer.id);
  return (
    <div>
      {history.map((game, i) => {
        return (
          <div>
            <h1>Game {i + 1}:</h1>
            <GameHistory key={i} game={game} />
          </div>
        );
      })}
    </div>
  );
}
