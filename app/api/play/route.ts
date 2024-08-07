import { NextResponse } from "next/server";
import { processMove, getCurrentPlayer, getLatestGameState } from "@/app/_game";

export async function GET() {
  const currentPlayer = await getCurrentPlayer();
  const gameState = await getLatestGameState(currentPlayer.id);
  return NextResponse.json(gameState, { status: 200 });
}

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

export const revalidate = 0;
