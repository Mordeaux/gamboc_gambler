import { NextResponse } from "next/server";
import { processMove, getCurrentPlayer } from "@/app/_game";

export async function POST(request: Request) {
  const data = await request.json();
  const currentPlayer = await getCurrentPlayer();

  const newGameState = await processMove(
    currentPlayer,
    data.moveType,
    data.betAmount,
    data.betValue,
  );
  return NextResponse.json({ ...data, newGameState }, { status: 200 });
}
