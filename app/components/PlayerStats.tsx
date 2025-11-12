'use client';

type Props = {
  hp: number;
  kp: number;
  energy: number;
};

export default function PlayerStats({ hp, kp, energy }: Props) {
  const attack = async () => {
    try {
      const enemies = ['E1', 'E2', 'E3'];
      const targetId = enemies[Math.floor(Math.random() * enemies.length)];
      const res = await fetch('/api/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attackerId: 'P1', targetId }),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`Attack dealt ${data.damage} damage. Target HP: ${data.targetHP}`);
      }
    } catch {}
  };

  return (
    <div className="flex justify-between bg-gray-800 text-white p-2 rounded">
      <span>HP: {hp}</span>
      <span>KP: {kp}</span>
      <span>Energy: {energy}</span>
      <button onClick={attack} className="ml-4 px-3 py-1 bg-red-600 rounded hover:bg-red-500">Attack</button>
    </div>
  );
}