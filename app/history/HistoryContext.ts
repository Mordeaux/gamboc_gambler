import { createContext, useContext } from "react";
import GameHistoryType from "../history/GameHistoryType";

export const HistoryContext = createContext([] as GameHistoryType[][]);

export const useHistory = () => {
  return useContext(HistoryContext);
};
