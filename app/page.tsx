"use client";
import History from "@/app/history/History";
import Game from "@/app/play/Game";
import { useState } from "react";

export default function Home() {
  const [displayHistory, setDisplayHistory] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="border-solid border-8 border-c4/60 rounded-2xl w-full p-10 bg-c3">
        <Game />
        <button
          className="bg-c1 font-semibold py-2 px-4 border border-c2 rounded m-10"
          onClick={(e) => {
            e.preventDefault();
            console.log("displayHistory", displayHistory);
            setDisplayHistory(!displayHistory);
          }}
        >
          See History
        </button>
      </div>
      {displayHistory && (
        <div className="border-solid border-8 border-c4/60 rounded-2xl w-full p-10 bg-c3 m-2">
          <History />
        </div>
      )}
    </main>
  );
}
