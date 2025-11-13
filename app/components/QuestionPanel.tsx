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
  // no timer tracking needed
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
    } catch (e) {
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
    <section className="flex flex-col gap-3 p-5 bg-neutral-800/80 rounded-xl border border-neutral-700" aria-live="polite">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-200">Turn: Player P1</div>
        {!revealed && (
          <button
            aria-label="View question and start"
            onClick={reveal}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm font-medium"
          >
            View Question
          </button>
        )}
      </div>

      {revealed && (
        <div className="w-full h-2 bg-neutral-700 rounded">
          <div
            className="h-full bg-emerald-500 rounded transition-[width] duration-100"
            style={{ width: `${Math.round((timeLeft / TOTAL_MS) * 100)}%` }}
          />
        </div>
      )}

      {revealed ? (
        <div className="flex flex-col gap-3">
          <div className="text-base font-medium text-white">Question {idx + 1} of {QUESTIONS.length}</div>
          <div className="text-sm text-neutral-200">{current.text}</div>
          <div className="grid grid-cols-2 gap-2">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleClick(opt)}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm font-medium"
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <div className={`text-sm ${feedback.startsWith('Correct') ? 'text-emerald-400' : 'text-red-400'}`}>{feedback}</div>
          )}
        </div>
      ) : (
        <div className="text-xs text-neutral-300">Question hidden. Click &quot;View Question&quot; to begin.</div>
      )}

      {isFinished && (
        <div className="text-xs text-neutral-300">All questions completed.</div>
      )}
    </section>
  );
}