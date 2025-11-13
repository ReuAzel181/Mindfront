# Mindfront

Minimal Next.js (App Router) + Tailwind CSS frontend for the Mindfront game, with mock backend API routes and Supabase client initialization. Everything is placeholder-style: boxes, text, and simple layouts. Runs locally and deploys cleanly to Vercel.

## Tech Stack
- Next.js `16` (App Router)
- React `19.0.0`, React DOM `19.0.0`
- Tailwind CSS `v4`
- TypeScript
- Supabase JS client (init only; no real DB writes yet)

## Quick Start
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open `http://localhost:3000`

Optional environment variables (for Supabase init): create `.env.local` and set:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
The app works without these; they are initialized but not required for mock logic.

## Project Structure
```
app/
  api/
    answer/route.ts        # Mock answer validation (+KP, +Energy)
    attack/route.ts        # Mock attack damage
  components/
    GameBoard.tsx          # 10x10 grid, color-coded cells
    PlayerStats.tsx        # Displays HP/KP/Energy + Attack button
    QuestionPanel.tsx      # 2+2 question; posts to /api/answer
  layout.tsx               # Imports styles/globals.css
  page.tsx                 # Page layout and client-side state
lib/
  supabaseClient.ts        # Supabase client init + table types
styles/
  globals.css              # Tailwind v4 directives and minimal theme
tailwind.config.js         # Content globs for Tailwind
next.config.ts             # reactCompiler disabled (stable React)
package.json               # Scripts and pinned versions
```

## UI Overview
- `PlayerStats`: shows `HP`, `KP`, `Energy`; includes an `Attack` button that posts to `/api/attack` and logs damage.
- `GameBoard`: renders a `10x10` grid with:
  - `bg-green-500` for ally camp
  - `bg-red-500` for enemy camp
  - `bg-gray-600` for empty slots
  Each square shows `Player ID` or `Empty` and `HP` (mocked).
  Simulates realtime via `setInterval` to randomly reduce enemy HP every few seconds.
- `QuestionPanel`: displays `Question: What is 2 + 2 ?` with `[4] [5] [3] [6]`. Clicking an option posts to `/api/answer`; correct answers increment stats locally.

Page layout (`app/page.tsx`):
- Top: `<PlayerStats />`
- Middle: `<GameBoard />`
- Bottom: `<QuestionPanel />`
- Container uses `flex flex-col items-center gap-4 min-h-screen bg-black text-white`.

## API Routes

### `POST /api/answer`
Input JSON:
```
{ "playerId": "P1", "questionId": "Q1", "answer": 4 }
```
Behavior:
- Validates mock correctness (`answer === 4`).
- If correct: `+10 KP`, `+5 Energy`.

Response:
```
{ "success": true, "newKP": 10, "newEnergy": 5 }
```

Example:
```
curl -X POST http://localhost:3000/api/answer \
  -H "Content-Type: application/json" \
  -d '{"playerId":"P1","questionId":"Q1","answer":4}'
```

### `POST /api/attack`
Input JSON:
```
{ "attackerId": "P1", "targetId": "E1" }
```
Behavior:
- Deals random damage (`10–30 HP`).
- Returns mocked `targetHP` from a base value.

Response:
```
{ "success": true, "damage": 23, "targetHP": 57 }
```

Example:
```
curl -X POST http://localhost:3000/api/attack \
  -H "Content-Type: application/json" \
  -d '{"attackerId":"P1","targetId":"E1"}'
```

## Supabase Initialization
File: `lib/supabaseClient.ts`
```
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

Mock table shapes (for future use):
- `players(id, name, hp, kp, energy, x, y)`
- `questions(id, text, options, correct_answer)`

## Tailwind CSS
- Tailwind v4, imported via `@import "tailwindcss";` in `styles/globals.css`.
- Components use simple utility classes for layout and colors.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — run production build
- `npm run lint` — lint files

## Deployment (Vercel)
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables (optional).
- Deploy directly from the Vercel dashboard or CLI.
- Compatible with `vercel dev` locally (optional; requires Vercel CLI).

## Troubleshooting
- React version mismatch warning:
  - Ensure `react` and `react-dom` are both `19.0.0` in `package.json`.
  - Delete `.next` and restart: `Remove-Item -Recurse -Force .next` (PowerShell), then `npm run dev`.
- Port conflict: run `npm run dev -- -p 3001`.

## Notes
- This project is intentionally minimal and uses mocked logic. There is no real backend persistence yet.
- Replace mocks with Supabase reads/writes and Realtime once credentials and tables are available.