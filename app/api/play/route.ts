import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const random = Math.floor(Math.random() * 6) + 1;
  return NextResponse.json(
    { ...data, winner: random === data.betValue },
    { status: 200 },
  );
}
