import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn helper — merges Tailwind class lists, dedupes conflicting
// utilities (e.g. `px-2 px-4` → `px-4`).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}