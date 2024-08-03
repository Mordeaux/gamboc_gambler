import { PrismaClient } from "@prisma/client";
import MoveType from "@/app/_game/MoveType";
import GameHistoryType from "@/app/history/GameHistoryType";

const prisma = new PrismaClient();

export const getHistory = async (playerId: string) => {
  const history = await prisma.gameState.findMany({
    where: { playerId },
    orderBy: { createdAt: "asc" },
    include: { bet: true },
  });

  const chunkedHistory: GameHistoryType[][] = [[]];
  history.map((gameState) => {
    const gameIndex = chunkedHistory.length - 1;
    if (
      [MoveType.Bankruptcy, MoveType.Withdrawal].includes(
        gameState.moveType as MoveType,
      )
    ) {
      chunkedHistory[gameIndex].push(gameState);
      chunkedHistory.push([]);
    } else if (gameState.moveType !== MoveType.StartGame) {
      if (!gameState.bet) {
        throw new Error("Bet must be provided when moveType is Bet");
      }
      chunkedHistory[gameIndex].push({
        ...gameState,
        betAmount: gameState.bet.amount,
        betValue: gameState.bet.value,
        rollValue: gameState.bet.rolledValue,
      });
    }
  });
  return chunkedHistory;
};
