import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { MoveType, createNextGameState, getLatestGameState } from "@/app/_game";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();
  let bet = null;
  const alice = await prisma.user.findFirstOrThrow({
    where: { name: "Alice" },
  });

  if (data.moveType === MoveType.Bet) {
    bet = {
      betAmount: data.betAmount,
      betValue: data.betValue,
    };
  }

  const gameState = await getLatestGameState(alice.id);
  const newGameState = await createNextGameState(gameState, data.moveType, bet);

  return NextResponse.json({ ...data, newGameState }, { status: 200 });
}
