import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

const DEBUG_LOG_PATH = path.resolve(__dirname, ".cursor/debug.log");

// #region agent log
function debugLogBuildOutput(data: Record<string, unknown>) {
  try {
    const outDir = path.resolve(__dirname, "dist");
    const htmlPath = path.join(outDir, "index.html");
    if (!fs.existsSync(htmlPath)) return;
    const html = fs.readFileSync(htmlPath, "utf-8");
    const baseMatch = html.match(/<base\s+href="([^"]*)"/);
    const scriptMatch = html.match(/<script[^>]+src="([^"]+)"/);
    const linkCssMatch = html.match(/<link[^>]+href="([^"]+\.css)"/);
    const payload = {
      sessionId: "debug-session",
      runId: "build",
      hypothesisId: "H2",
      location: "vite.config.ts:closeBundle",
      message: "Build output: dist/index.html base and asset URLs",
      data: {
        baseHref: baseMatch ? baseMatch[1] : null,
        scriptSrc: scriptMatch ? scriptMatch[1] : null,
        linkCssHref: linkCssMatch ? linkCssMatch[1] : null,
        hasCreativeCanvasInBase: (baseMatch?.[1] ?? "").includes("creative-canvas-portfolio"),
        hasCreativeCanvasInScript: (scriptMatch?.[1] ?? "").includes("creative-canvas-portfolio"),
      },
      timestamp: Date.now(),
    };
    fs.appendFileSync(DEBUG_LOG_PATH, JSON.stringify(payload) + "\n");
  } catch (_) {}
}
// #endregion

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "debug-log-build-output",
      closeBundle() {
        // #region agent log
        debugLogBuildOutput({});
        // #endregion
      },
    },
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
