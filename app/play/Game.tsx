import Bet from "./Bet";

export default function Game() {
  const balance = 1000;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Game</h1>
        <div>Balance: {balance}</div>
        <Bet balance={balance} />
      </div>
    </main>
  );
}
