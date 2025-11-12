import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Mock table shapes (for reference only)
export type Player = {
  id: string;
  name: string;
  hp: number;
  kp: number;
  energy: number;
  x: number;
  y: number;
};

export type Question = {
  id: string;
  text: string;
  options: number[];
  correct_answer: number;
};