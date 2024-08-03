import { NextResponse } from "next/server";
import { getHistory } from "@/app/history/getHistory";
import { getCurrentPlayer } from "@/app/_game";

export async function GET() {
  const currentPlayer = await getCurrentPlayer();
  const history = await getHistory(currentPlayer.id);
  return NextResponse.json({ history });
}
