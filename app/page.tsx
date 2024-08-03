import Link from "next/link";
import Game from "./play/Game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Game />
        <h1 className="text-3xl font-bold underline">
          <Link href="/history">See History</Link>
        </h1>
      </div>
    </main>
  );
}
