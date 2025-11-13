"use client";

import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex flex-col items-center justify-center gap-6 min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold">Mindfront</h1>
      <p className="text-sm text-gray-300">A minimal placeholder landing. Enter to choose your camp and play.</p>
      <Link
        href="/enter"
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        Enter
      </Link>
    </main>
  );
}
