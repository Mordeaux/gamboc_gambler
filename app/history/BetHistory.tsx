import MoveType from "@/app/_game/MoveType";
import { formatDateTime } from "../utils";
import GameHistoryType from "@/app/history/GameHistoryType";
import Die, { DieColor } from "@/app/history/Die";

const BetHistory = ({
  gameState,
  previousBalance,
}: {
  gameState: GameHistoryType;
  previousBalance: number;
}) => {
  const { createdAt, betAmount, betValue, rollValue, balance } = gameState;

  if (gameState.moveType === MoveType.Withdrawal) {
    return (
      <div>
        You withdrew {previousBalance!} chip{previousBalance! > 1 ? "s" : ""}
      </div>
    );
  } else if (gameState.moveType === MoveType.Bankruptcy) {
    return <div>You went bankrupt. Please seek help</div>;
  }

  return (
    <div>
      {formatDateTime(new Date(createdAt))}
      <div className="flex justify-center p-4">
        You bet {betAmount} chip{betAmount! > 1 ? "s" : ""} on:{" "}
        <Die dieSide={betValue!} color={DieColor.Black} />
      </div>
      <div className="flex justify-center">
        You rolled:
        <Die dieSide={rollValue!} color={DieColor.White} />
      </div>
      <p>Balance: {balance}</p>
    </div>
  );
};

export default BetHistory;
