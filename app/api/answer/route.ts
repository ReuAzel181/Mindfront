import { NextResponse } from "next/server";

type AnswerBody = {
  playerId: string;
  questionId: string;
  answer: number;
  elapsedMs?: number; // time between reveal and answer
};

const mockQuestions: Record<string, { correct_answer: number }> = {
  Q1: { correct_answer: 4 },
  Q2: { correct_answer: 15 },
  Q3: { correct_answer: 5 },
  Q4: { correct_answer: 4 },
  Q5: { correct_answer: 13 },
};

function computeKP(correct: boolean, elapsedMs = 0) {
  if (!correct) return 0;
  // Early and correct yields higher KP. Max 20, min 5, decays ~1 per second.
  const raw = 20 - Math.floor((elapsedMs || 0) / 1000);
  return Math.max(5, raw);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnswerBody;
    const q = mockQuestions[body.questionId] ?? { correct_answer: 4 };
    const correct = Number(body.answer) === q.correct_answer;
    const newKP = computeKP(correct, body.elapsedMs);
    const res = { success: true, newKP, newEnergy: correct ? 5 : 0 };
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}