'use client';

type Props = {
  hp: number;
  kp: number;
  energy: number;
  onOpenShop?: () => void;
};

export default function PlayerStats({ hp, kp, energy, onOpenShop }: Props) {
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
    <div className="w-full rounded-2xl bg-gradient-to-br from-[#1b2534] to-[#0f1826] text-white p-4 shadow-lg border border-[#223448]">
      <div className="grid grid-cols-4 items-center gap-4">
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
        <div className="flex justify-end gap-2">
          <button
            onClick={onOpenShop}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm font-semibold shadow"
          >
            Shop
          </button>
          <button
            onClick={attack}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm font-semibold shadow"
          >
            Attack
          </button>
        </div>
      </div>
    </div>
  );
}