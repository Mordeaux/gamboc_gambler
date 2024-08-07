import Link from "next/link";
import History from "@/app/history/History";
import Game from "@/app/play/Game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="border-solid border-8 border-c4/60 rounded-2xl w-full p-10 bg-c3">
        <Game />
        <Link href="/history">
          <button className="bg-c1 font-semibold py-2 px-4 border border-c2 rounded m-10">
            See History
          </button>
        </Link>
      </div>
      <div className="border-solid border-8 border-c4/60 rounded-2xl w-full p-10 bg-c3 m-2">
        <History />
      </div>
    </main>
  );
}
