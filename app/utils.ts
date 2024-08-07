import GameHistoryType from "./history/GameHistoryType";

export const formatDateTime = (date: Date) => {
  const getOrdinal = (n: number) => {
    const finalDigit = n % 10;
    switch (finalDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `On ${dayOfWeek}, the ${day}${getOrdinal(day)} of ${month}, ${year} at ${hour}:${minute}:${second}`;
};

export const hasWon = (history: GameHistoryType[][]) =>
  history.slice(-1)[0]?.length > 0 &&
  history
    .slice(-1)[0]
    ?.some((gameState) => gameState.betValue === gameState.rollValue);
