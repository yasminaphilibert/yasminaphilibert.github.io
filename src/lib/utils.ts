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
 * encodeURIComponent is built for query-string values, so it also escapes
 * characters that are perfectly legal inside a path segment (RFC 3986
 * sub-delims). Restoring them is not cosmetic: a filename containing a comma
 * became %2C, and static servers that match paths without decoding sub-delims —
 * `vite preview` among them — answered with the SPA fallback instead of the
 * image. Every server accepts these literally; only some accept them escaped.
 *
 * `+` and `;` stay escaped: some servers read a literal `+` as a space, or
 * truncate a segment at `;` treating the rest as path parameters.
 */
const PATH_SAFE_ESCAPES: [RegExp, string][] = [
  [/%2C/g, ","],
  [/%3A/g, ":"],
  [/%40/g, "@"],
  [/%24/g, "$"],
  [/%26/g, "&"],
  [/%3D/g, "="],
];

/**
 * Encode path for use in src/href so Unicode filenames work on GitHub Pages and strict servers.
 * e.g. /videos/Yasyntha-Ākāsadhātu.webm -> /videos/Yasyntha-%C4%80k%C4%81sadh%C4%81tu.webm
 */
export function encodeAssetUrl(path: string): string {
  if (!path || typeof path !== "string") return path;
  try {
    const encoded = path
      .split("/")
      .map((segment) => {
        if (!segment) return "";
        let out = encodeURIComponent(segment);
        for (const [pattern, char] of PATH_SAFE_ESCAPES) {
          out = out.replace(pattern, char);
        }
        return out;
      })
      .join("/");
    // Avoid leading double slash: "/videos/x" -> "//videos/x" -> "/videos/x"
    return encoded.replace(/^\/+/, "/");
  } catch {
    return path;
  }
}
