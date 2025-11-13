"use client";

import { useMemo } from "react";

type Stats = { hp: number; kp: number; energy: number };

export type ShopItem = {
  key: string;
  name: string;
  cost: number;
  desc: string;
  icon: string;
  apply: (s: Stats) => Stats;
};

type Props = {
  kp: number;
  setStats: React.Dispatch<React.SetStateAction<Stats>>;
  onClose?: () => void;
  onAcquire?: (item: ShopItem) => void;
};

export default function Shop({ kp, setStats, onClose, onAcquire }: Props) {
  const items = useMemo<ShopItem[]>(
    () => [
      { key: "potion", name: "Energy Potion", cost: 15, desc: "+10 Energy", icon: "🧪", apply: (s: Stats) => ({ ...s, energy: s.energy + 10 }) },
      { key: "shield", name: "Fortify Shield", cost: 30, desc: "+20 HP", icon: "🛡️", apply: (s: Stats) => ({ ...s, hp: Math.min(100, s.hp + 20) }) },
      { key: "tome", name: "Tome of Insight", cost: 25, desc: "+5 KP Bonus Next", icon: "📜", apply: (s: Stats) => ({ ...s }) },
    ],
    []
  );

  const buy = (item: ShopItem) => {
    setStats((prev) => (prev.kp >= item.cost ? { ...prev, kp: prev.kp - item.cost } : prev));
    if (onAcquire && kp >= item.cost) onAcquire(item);
  };

  return (
    <div className="w-full bg-[#10151a] border border-neutral-700 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">Shop</div>
        {onClose && (
          <button onClick={onClose} className="px-3 py-1.5 bg-neutral-700 rounded-lg hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 text-sm">Close</button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.key} className="rounded-xl bg-[#182028] p-3 border border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <span className="text-lg">{it.icon}</span>
                <span>{it.name}</span>
              </div>
              <div className="text-xs px-2 py-0.5 rounded bg-blue-600/80">{it.cost} KP</div>
            </div>
            <div className="mt-2 text-sm text-neutral-300">{it.desc}</div>
            <button
              disabled={kp < it.cost}
              onClick={() => buy(it)}
              className="mt-3 w-full px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {kp < it.cost ? "Insufficient KP" : "Buy to Inventory"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}