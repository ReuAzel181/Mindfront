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
    <div className="w-full rounded-xl bg-[#1f2d3d] text-white p-3 shadow-md">
      <div className="grid grid-cols-4 items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#243645]">
          <span className="text-lg">🔰</span>
          <div className="text-sm">
            <div className="text-neutral-300">HP</div>
            <div className="font-semibold">{hp}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#243645]">
          <span className="text-lg">🔷</span>
          <div className="text-sm">
            <div className="text-neutral-300">KP</div>
            <div className="font-semibold">{kp}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#243645]">
          <span className="text-lg">⚡</span>
          <div className="text-sm">
            <div className="text-neutral-300">Energy</div>
            <div className="font-semibold">{energy}</div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={attack}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm font-semibold"
          >
            Attack
          </button>
        </div>
      </div>
    </div>
  );
}