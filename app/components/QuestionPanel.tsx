'use client';

type Props = {
  setStats: (fn: (s: { hp: number; kp: number; energy: number }) => any) => void;
};

export default function QuestionPanel({ setStats }: Props) {
  const options = [4, 5, 3, 6];

  const handleClick = async (value: number) => {
    console.log('Answer chosen');
    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: 'P1', questionId: 'Q1', answer: value }),
      });
      const data = await res.json();
      if (data.success) {
        setStats((prev) => ({ ...prev, kp: prev.kp + (data.newKP || 0), energy: prev.energy + (data.newEnergy || 0) }));
      }
    } catch (e) {
      // swallow for mock
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-700 rounded">
      <div className="text-sm">Question: What is 2 + 2 ?</div>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleClick(opt)}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded"
          >
            [{opt}]
          </button>
        ))}
      </div>
    </div>
  );
}