import { NextResponse } from "next/server";

type AnswerBody = {
  playerId: string;
  questionId: string;
  answer: number;
};

const mockQuestions: Record<string, { correct_answer: number }> = {
  Q1: { correct_answer: 4 },
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnswerBody;
    const q = mockQuestions[body.questionId] ?? { correct_answer: 4 };
    const correct = Number(body.answer) === q.correct_answer;

    const res = correct
      ? { success: true, newKP: 10, newEnergy: 5 }
      : { success: true, newKP: 0, newEnergy: 0 };

    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}