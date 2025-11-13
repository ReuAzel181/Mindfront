'use client';

import { useEffect, useRef, useState } from 'react';

type Stats = { hp: number; kp: number; energy: number };
type Props = {
  setStats: React.Dispatch<React.SetStateAction<Stats>>;
};

type Question = {
  id: string;
  text: string;
  options: number[];
  correct: number;
};

const QUESTIONS: Question[] = [
  { id: 'Q1', text: 'What is 2 + 2 ?', options: [4, 5, 3, 6], correct: 4 },
  { id: 'Q2', text: 'What is 5 × 3 ?', options: [10, 12, 15, 18], correct: 15 },
  { id: 'Q3', text: 'What is 9 − 4 ?', options: [4, 5, 7, 6], correct: 5 },
  { id: 'Q4', text: 'What is 12 ÷ 3 ?', options: [2, 3, 4, 6], correct: 4 },
  { id: 'Q5', text: 'What is 7 + 6 ?', options: [11, 12, 13, 14], correct: 13 },
];

export default function QuestionPanel({ setStats }: Props) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const TOTAL_MS = 15000;

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const current = QUESTIONS[idx];

  const reveal = () => {
    setRevealed(true);
    setFeedback(null);
    setTimeLeft(TOTAL_MS);
  };

  const handleClick = async (value: number) => {
    if (!revealed || !current) return;
    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: 'P1', questionId: current.id, answer: value }),
      });
      const data = await res.json();
      if (data.success) {
        const correct = value === current.correct;
        setFeedback(correct ? `Correct! +${data.newKP} KP` : 'Wrong');
        setStats((prev) => ({ ...prev, kp: prev.kp + (data.newKP || 0), energy: prev.energy + (data.newEnergy || 0) }));
        // proceed to next question after short delay
        closeTimer.current = setTimeout(() => {
          setRevealed(false);
          setFeedback(null);
          setIdx((i) => Math.min(i + 1, QUESTIONS.length - 1));
        }, 800);
      }
    } catch {
      setFeedback('Error submitting answer');
    }
  };

  useEffect(() => {
    if (!revealed) return;
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 100));
    }, 100);
    return () => clearInterval(id);
  }, [revealed]);

  const isFinished = idx >= QUESTIONS.length - 1 && !revealed && feedback === null;

  return (
    <section className="flex flex-col gap-5 p-6 bg-gradient-to-br from-[#0b1220] via-[#0f1e2e] to-[#0b1220] rounded-2xl border border-[#223448] shadow-2xl" aria-live="polite">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-lg bg-[#1b2a3a] text-xs font-semibold text-neutral-200">Turn: Player P1</div>
          <div className="px-2.5 py-1 rounded-lg bg-purple-600/80 text-xs font-semibold">Arena Quiz</div>
        </div>
        {!revealed && (
          <button
            aria-label="View question and start"
            onClick={reveal}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm font-semibold shadow"
          >
            View Question
          </button>
        )}
      </div>

      {revealed && (
        <div className="w-full h-2 rounded bg-[#0e1a28] overflow-hidden">
          <div
            className="h-full rounded bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 shadow-[0_0_12px_#10b981] transition-[width] duration-100"
            style={{ width: `${Math.round((timeLeft / TOTAL_MS) * 100)}%` }}
          />
        </div>
      )}

      {revealed ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-purple-600 text-xs font-semibold">Math</div>
            <div className="px-2.5 py-1 rounded bg-amber-600 text-xs font-semibold">Easy</div>
            <div className="text-sm text-neutral-300">Round {idx + 1}/{QUESTIONS.length}</div>
          </div>
          <div className="text-2xl font-semibold text-white tracking-wide">{current.text}</div>
          <div className="grid grid-cols-2 gap-3">
            {current.options.map((opt, i) => (
              <button
                key={opt}
                onClick={() => handleClick(opt)}
                className="group px-4 py-4 rounded-xl bg-gradient-to-br from-[#1c2a3a] to-[#122033] hover:from-[#26384a] hover:to-[#1a2b3f] border border-[#2a3d52] text-left focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-transform duration-150 hover:-translate-y-0.5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow">{String.fromCharCode(65 + i)}</div>
                  <div className="text-base text-white">{opt}</div>
                </div>
              </button>
            ))}
          </div>
          {feedback && (
            <div className={`text-sm font-medium ${feedback.startsWith('Correct') ? 'text-emerald-400' : 'text-red-400'}`}>{feedback}</div>
          )}
        </div>
      ) : (
        <div className="text-sm text-neutral-300">
          Question hidden. Click &quot;View Question&quot; to begin.
        </div>
      )}

      {isFinished && (
        <div className="text-xs text-neutral-300">All questions completed.</div>
      )}
    </section>
  );
}