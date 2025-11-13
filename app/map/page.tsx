"use client";

import { useState } from "react";

export default function MapPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const tiles = [0, 1, 2, 3];

  const toggle = (i: number) => {
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const isSelected = (i: number) => selected.includes(i);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0b0e12] p-4">
      <h1 className="text-2xl font-extrabold text-white mb-2">Mindfront — Temporary Map</h1>
      <p className="text-sm text-gray-300 mb-4">Four identical tiles arranged in a responsive layout with selection animation.</p>

      {/* Map container: responsive 2×2 on medium+ screens, 1×4 stacked on small */}
      <div className="w-full max-w-5xl rounded-lg border border-gray-700 bg-neutral-900/70 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiles.map((i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected(i)}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              className={`relative rounded-xl overflow-hidden bg-neutral-800 border transition-colors duration-300 ease-out select-none ${
                isSelected(i) ? "border-emerald-400" : "border-neutral-700"
              }`}
            >
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isSelected(i) ? "opacity-30 bg-emerald-400/20" : "opacity-0"
                }`}
              />
              <img
                src="/temp_tile.png"
                alt={`Temporary island tile ${i + 1}`}
                className={`w-full h-auto object-contain transition-transform duration-300 ease-out ${
                  isSelected(i) ? "scale-[1.06]" : "scale-100"
                }`}
                draggable={false}
              />
              <div
                className={`absolute inset-0 rounded-xl ring-0 transition-all duration-300 ease-out pointer-events-none ${
                  isSelected(i) ? "ring-2 ring-emerald-400" : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">Place your temporary image at <code className="font-mono">/public/temp_tile.png</code>. Click tiles to select/deselect.</p>
    </main>
  );
}