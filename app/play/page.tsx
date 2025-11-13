"use client";

import { useEffect, useRef, useState } from "react";
import PlayerStats from "../components/PlayerStats";
import Shop, { ShopItem } from "../components/Shop";
import QuestionPanel from "../components/QuestionPanel";

export default function Play() {
  const [stats, setStats] = useState({ hp: 100, kp: 0, energy: 50 });
  const [showMap, setShowMap] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [inventory, setInventory] = useState<ShopItem[]>([]);
  const [tileEffects, setTileEffects] = useState<Record<number, { key: string; icon: string }[]>>({});
  const tiles = [0, 1, 2, 3];
  const toggleTile = (i: number) => {
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };
  const isSelected = (i: number) => selected.includes(i);

  const toggleMap = () => setShowMap((v) => !v);
  const onKeyToggle = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMap();
    }
  };

  useEffect(() => {
    if (showMap && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [showMap]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMap(false);
    };
    if (showMap) {
      window.addEventListener("keydown", handler);
    }
    return () => window.removeEventListener("keydown", handler);
  }, [showMap]);

  return (
    <main className="flex flex-col items-center gap-4 min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-4xl">
        <PlayerStats hp={stats.hp} kp={stats.kp} energy={stats.energy} onOpenShop={() => setShowMap(true)} />
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#1f2d3d] to-[#162235] border border-[#223448]">Arena: Northern Shelf</div>
          <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#1f2d3d] to-[#162235] border border-[#223448]">Mode: Siege</div>
          <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#1f2d3d] to-[#162235] border border-[#223448]">Round: 1</div>
        </div>
      </div>

      {/* Question view remains active while map is hidden */}
      <div
        className="w-full max-w-4xl relative"
        aria-hidden={showMap}
        aria-live="polite"
      >
        <QuestionPanel setStats={setStats} />
        {/* View Map button: prominent but non-blocking (fixed on small screens) */}
        <div className="mt-3 flex justify-end">
          <button
            aria-label="View kingdom map"
            aria-controls="kingdom-map"
            aria-expanded={showMap}
            aria-pressed={showMap}
            onKeyDown={onKeyToggle}
            onClick={toggleMap}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 md:self-end md:static fixed md:relative right-4 bottom-4"
          >
            View Map
          </button>
        </div>
      </div>

      {showMap && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kingdom map overlay"
          className="fixed inset-0 z-40 bg-black/80"
        >
          <div
            id="kingdom-map"
            className="fixed inset-0"
          >
            <button
              ref={closeBtnRef}
              aria-label="Hide map and return to question"
              onClick={toggleMap}
              className="absolute z-20 top-4 right-4 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow hover:from-red-500 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Hide Map
            </button>
            <div className="relative z-10 grid grid-cols-12 gap-0 h-full w-full">
              <div className="col-span-8 bg-[#1a2432] grid grid-cols-1 sm:grid-cols-2">
                {tiles.map((i) => (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected(i)}
                    onClick={() => toggleTile(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const idxStr = e.dataTransfer.getData("inventory-index");
                      const idxNum = idxStr ? parseInt(idxStr, 10) : -1;
                      const item = inventory[idxNum];
                      if (!item) return;
                      setInventory((prev) => prev.filter((_, j) => j !== idxNum));
                      setTileEffects((prev) => ({ ...prev, [i]: [...(prev[i] || []), { key: item.key, icon: item.icon }] }));
                      setStats((prev) => item.apply(prev));
                    }}
                    className={`relative overflow-hidden select-none flex items-center justify-center`}
                  >
                      <img
                        src="/regions/island_land.png"
                        alt={`Island tile ${i + 1}`}
                        className="w-[60%] h-auto object-contain"
                        draggable={false}
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {(tileEffects[i] || []).map((t, idx) => (
                          <span key={`${t.key}-${idx}`} className="px-2 py-0.5 text-xs rounded bg-blue-600/80">{t.icon}</span>
                        ))}
                      </div>
                  </div>
                ))}
              </div>
              <div className="col-span-4 bg-[#0f1724] border-l border-[#223448] p-4 overflow-y-auto">
                <div className="text-lg font-semibold mb-3">Shop & Inventory</div>
                <Shop kp={stats.kp} setStats={setStats} onAcquire={(it) => setInventory((prev) => [...prev, it])} />
                <div className="mt-4">
                  <div className="text-sm text-neutral-300 mb-2">Inventory (drag onto a region)</div>
                  <div className="grid grid-cols-2 gap-2">
                    {inventory.length === 0 && (
                      <div className="text-xs text-neutral-500">Empty</div>
                    )}
                    {inventory.map((it, idx) => (
                      <div
                        key={`${it.key}-${idx}`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("inventory-index", String(idx));
                        }}
                        className="rounded-lg border border-neutral-700 bg-[#182028] p-2 flex items-center gap-2 cursor-grab active:cursor-grabbing"
                      >
                        <span className="text-lg">{it.icon}</span>
                        <span className="text-sm">{it.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </main>
  );
}