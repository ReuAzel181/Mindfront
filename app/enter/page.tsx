"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Enter() {
  const [selectedCamp, setSelectedCamp] = useState<string | null>(null);
  const router = useRouter();

  const tiles = [0, 1, 2, 3];
  const selectTile = (i: number) => setSelectedCamp(`Tile-${i + 1}`);
  const isSelected = (i: number) => selectedCamp === `Tile-${i + 1}`;

  const startGame = () => {
    if (selectedCamp) router.push(`/play?camp=${encodeURIComponent(selectedCamp)}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#27c0ff] text-white">
      <div className="fixed inset-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 h-full w-full gap-0">
          {tiles.map((i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected(i)}
              onClick={() => selectTile(i)}
              className={`relative overflow-hidden select-none flex items-center justify-center`}
            >
              <img
                src="/regions/island_land.png"
                alt={`Temporary island tile ${i + 1}`}
                className="w-[60%] h-auto object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-2xl font-semibold">Enter Arena</h1>
        <p className="text-sm">Choose a tile. Click to select, then start.</p>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button
          disabled={!selectedCamp}
          onClick={startGame}
          className="px-4 py-2 bg-green-600 rounded disabled:bg-gray-700 hover:bg-green-500"
        >
          Start Game
        </button>
      </div>
    </main>
  );
}