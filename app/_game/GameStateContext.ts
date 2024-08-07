import { createContext, useContext } from "react";
import GameHistoryType from "../history/GameHistoryType";

export const GameStateContext = createContext({
  gameState: {} as GameHistoryType | null,
  setGameState: (gameState: GameHistoryType | null) => {},
});

export const useGameState = () => {
  return useContext(GameStateContext);
};
