"use client";

import { useEffect, useMemo, useState } from "react";

type Camp = {
  id: string;
  name: string;
  x: number; // 0..9
  y: number; // 0..9
  faction: "ally" | "enemy" | "neutral";
  hp: number;
};

type Props = {
  camps?: Camp[];
  playerCampId?: string;
  onSelectCamp?: (campId: string) => void;
};

const defaultCamps: Camp[] = [
  { id: "NorthKeep", name: "North Keep", x: 2, y: 1, faction: "enemy", hp: 80 },
  { id: "EastWatch", name: "East Watch", x: 7, y: 2, faction: "neutral", hp: 60 },
  { id: "WestVale", name: "West Vale", x: 1, y: 7, faction: "neutral", hp: 60 },
  { id: "SouthFort", name: "South Fort", x: 8, y: 8, faction: "enemy", hp: 90 },
  { id: "RiverCamp", name: "River Camp", x: 4, y: 5, faction: "neutral", hp: 70 },
  { id: "Highlands", name: "Highlands", x: 5, y: 1, faction: "enemy", hp: 85 },
  { id: "Meadow", name: "Meadow", x: 3, y: 8, faction: "neutral", hp: 60 },
];

export default function GameBoard({ camps, playerCampId, onSelectCamp }: Props) {
  const [campState, setCampState] = useState<Camp[]>(camps ?? defaultCamps);

  useEffect(() => {
    const interval = setInterval(() => {
      setCampState((prev) => {
        const enemyIdxs = prev
          .map((c, i) => (c.id !== playerCampId && c.faction === "enemy" ? i : -1))
          .filter((i) => i >= 0);
        if (!enemyIdxs.length) return prev;
        const pick = enemyIdxs[Math.floor(Math.random() * enemyIdxs.length)];
        const delta = Math.floor(Math.random() * 6); // 0-5
        const next = [...prev];
        next[pick] = { ...next[pick], hp: Math.max(0, next[pick].hp - delta) };
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [playerCampId]);

  const gridCells = useMemo(() => {
    const size = 10;
    const cells: { x: number; y: number; camp: Camp | null; region: number }[] = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const campHere = campState.find((c) => c.x === x && c.y === y) || null;
        // Roughly divide the board into 9 regions (#1–#9) to mimic a kingdom map.
        // This is a simple 3x3 segmentation with slight offsets to avoid a strict grid feel.
        const rx = x < 3 ? 0 : x < 7 ? 1 : 2;
        const ry = y < 3 ? 0 : y < 7 ? 1 : 2;
        const region = ry * 3 + rx + 1; // 1..9
        cells.push({ x, y, camp: campHere, region });
      }
    }
    return cells;
  }, [campState]);

  return (
    <div className="grid grid-cols-10 gap-1">
      {gridCells.map((cell, idx) => {
        const c = cell.camp;
        let faction: "ally" | "enemy" | "neutral" | "empty" = "empty";
        if (c) faction = c.id === playerCampId ? "ally" : c.faction;

        // Region-based shading akin to the reference image using multiple greens.
        const regionShade = ["bg-green-800","bg-green-700","bg-green-600","bg-green-700","bg-green-800","bg-green-700","bg-green-600","bg-green-700","bg-green-800"][cell.region-1];
        const bg =
          faction === "ally"
            ? "bg-green-500"
            : faction === "enemy"
            ? "bg-red-600"
            : faction === "neutral"
            ? "bg-yellow-600"
            : regionShade;

        return (
          <div
            key={idx}
            className={`aspect-square ${bg} rounded flex flex-col items-center justify-center text-[10px] ${
              c && onSelectCamp ? "cursor-pointer hover:opacity-90" : ""
            }`}
            onClick={() => {
              if (c && onSelectCamp) onSelectCamp(c.id);
            }}
          >
            <div className="font-medium">{c ? c.name : `#${cell.region}`}</div>
            <div>{c ? `HP: ${c.hp}` : ""}</div>
          </div>
        );
      })}
    </div>
  );
}