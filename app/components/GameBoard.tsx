"use client";

import { useEffect, useState } from "react";

type Cell = {
  id: string | null;
  hp: number;
  camp: "ally" | "enemy" | "empty";
};

function makeGrid(): Cell[] {
  return Array.from({ length: 100 }, (_, i) => {
    if (i % 15 === 0) return { id: "P1", hp: 100, camp: "ally" };
    if (i % 7 === 0) return { id: "E1", hp: 80, camp: "enemy" };
    return { id: null, hp: 0, camp: "empty" };
  });
}

export default function GameBoard() {
  const [grid, setGrid] = useState<Cell[]>(makeGrid());

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((g) => {
        const next = [...g];
        // randomly adjust an enemy cell
        const enemyIdxs = next
          .map((c, i) => (c.camp === "enemy" ? i : -1))
          .filter((i) => i >= 0);
        if (enemyIdxs.length) {
          const pick = enemyIdxs[Math.floor(Math.random() * enemyIdxs.length)];
          const delta = Math.floor(Math.random() * 6); // 0-5
          next[pick] = { ...next[pick], hp: Math.max(0, next[pick].hp - delta) };
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-10 gap-1">
      {grid.map((cell, idx) => {
        const bg =
          cell.camp === "ally"
            ? "bg-green-500"
            : cell.camp === "enemy"
            ? "bg-red-500"
            : "bg-gray-600";
        return (
          <div
            key={idx}
            className={`aspect-square ${bg} rounded flex flex-col items-center justify-center text-xs`}
          >
            <div>{cell.id ?? "Empty"}</div>
            <div>HP: {cell.hp}</div>
          </div>
        );
      })}
    </div>
  );
}