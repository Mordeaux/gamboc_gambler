import { Dispatch, SetStateAction } from "react";

const Bet = ({
  balance,
  betAmount,
  setBetAmount,
}: {
  balance: number;
  betAmount: number;
  setBetAmount: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        Bet Amount
      </label>
      <div className="relative mt-2 rounded-md shadow-sm w-1/3">
        <input
          type="number"
          name="betAmount"
          placeholder="Bet amount"
          min={1}
          max={balance}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              if (balance && value > balance) {
                console.error(`Bet amount exceeds balance ${value}`);
                setBetAmount(balance);
              }
              setBetAmount(parseInt(e.target.value));
            } else {
              console.error(`Invalid bet amount ${value}`);
              setBetAmount(betAmount);
            }
          }}
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};
export default Bet;
