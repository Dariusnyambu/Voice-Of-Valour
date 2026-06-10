import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  // Handle Google Sheets date serial numbers
  if (typeof dateStr === "number" || /^\d+$/.test(String(dateStr))) {
    const serial = Number(dateStr);
    const date = new Date((serial - 25569) * 86400 * 1000);
    return date.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
  }
  // Handle various string formats from Google Sheets
  // e.g. "6/5/2026 14:20:03" or "2026-06-05T14:20:03Z"
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // Try parsing M/D/YYYY H:MM:SS format
    const parts = String(dateStr).match(/(\d+)\/(\d+)\/(\d+)/);
    if (parts) {
      const d = new Date(`${parts[3]}-${parts[1].padStart(2,"0")}-${parts[2].padStart(2,"0")}`);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
      }
    }
    return String(dateStr).split(" ")[0] || "—";
  }
  return date.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
}

export function generateId(): string {
  return `VOV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
