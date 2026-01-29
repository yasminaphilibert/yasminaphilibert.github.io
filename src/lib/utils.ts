import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize asset paths so they work in production.
 * Vite serves public/ at the site root, so "public/videos/x.webm" must become "/videos/x.webm".
 */
export function normalizePublicAssetPath(path: string): string {
  if (!path || typeof path !== "string") return path;
  if (path.startsWith("public/")) return "/" + path.slice(7);
  return path;
}
