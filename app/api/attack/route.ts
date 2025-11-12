import { NextResponse } from "next/server";

type AttackBody = {
  attackerId: string;
  targetId: string;
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AttackBody;
    const damage = rand(10, 30);
    const baseHP = 80;
    const targetHP = Math.max(0, baseHP - damage);
    return NextResponse.json({ success: true, damage, targetHP });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}