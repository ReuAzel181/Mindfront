"use client";

import { useEffect, useRef, useState } from "react";
import PlayerStats from "../components/PlayerStats";
import QuestionPanel from "../components/QuestionPanel";

export default function Play() {
  const [stats, setStats] = useState({ hp: 100, kp: 0, energy: 50 });
  const [showMap, setShowMap] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
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
        <PlayerStats hp={stats.hp} kp={stats.kp} energy={stats.energy} />
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

      {/* Overlay map: replaces question view when visible */}
      {showMap && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kingdom map overlay"
          className="fixed inset-0 z-40 bg-black/80"
        >
          <div
            id="kingdom-map"
            className="fixed inset-0 bg-[#27c0ff]"
          >
            <button
              ref={closeBtnRef}
              aria-label="Hide map and return to question"
              onClick={toggleMap}
              className="absolute top-4 right-4 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Hide Map
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 h-full w-full">
              {tiles.map((i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected(i)}
                  onClick={() => toggleTile(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTile(i);
                    }
                  }}
                  className={`relative overflow-hidden transition-transform duration-300 ease-out select-none`}
                >
                    <img
                      src="/regions/island_land.png"
                      alt={`Island tile ${i + 1}`}
                      className={`w-full h-auto object-contain transition-transform duration-300 ease-out ${
                        isSelected(i) ? "scale-[0.95]" : "scale-[0.86]"
                      }`}
                      draggable={false}
                    />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}