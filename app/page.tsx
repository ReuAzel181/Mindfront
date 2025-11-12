"use client";

import { useState } from "react";
import PlayerStats from "./components/PlayerStats";
import GameBoard from "./components/GameBoard";
import QuestionPanel from "./components/QuestionPanel";

export default function Home() {
  const [stats, setStats] = useState({ hp: 100, kp: 0, energy: 50 });
  return (
    <main className="flex flex-col items-center gap-4 min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-4xl">
        <PlayerStats hp={stats.hp} kp={stats.kp} energy={stats.energy} />
      </div>
      <div className="w-full max-w-4xl">
        <GameBoard />
      </div>
      <div className="w-full max-w-4xl">
        <QuestionPanel setStats={setStats} />
      </div>
    </main>
  );
}
