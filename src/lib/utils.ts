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

/**
 * Encode path for use in src/href so Unicode filenames work on GitHub Pages and strict servers.
 * e.g. /videos/Yasyntha-Ākāsadhātu.webm -> /videos/Yasyntha-%C4%80k%C4%81sadh%C4%81tu.webm
 */
export function encodeAssetUrl(path: string): string {
  if (!path || typeof path !== "string") return path;
  try {
    const encoded = path
      .split("/")
      .map((segment) => (segment ? encodeURIComponent(segment) : ""))
      .join("/");
    // Avoid leading double slash: "/videos/x" -> "//videos/x" -> "/videos/x"
    return encoded.replace(/^\/+/, "/");
  } catch {
    return path;
  }
}
