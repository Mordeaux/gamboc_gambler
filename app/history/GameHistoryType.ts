import { GameState } from "@prisma/client";

type GameHistoryType = GameState & {
  betAmount?: number;
  betValue?: number;
  rollValue?: number;
};

export default GameHistoryType;
