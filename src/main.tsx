import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// #region agent log
(function() {
  try {
    const baseTag = document.querySelector('base');
    const baseHref = baseTag?.getAttribute('href') || null;
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.getAttribute('src'));
    const links = Array.from(document.querySelectorAll('link[href]')).map(l => l.getAttribute('href'));
    const payload = {
      sessionId: 'debug-session',
      runId: 'client-runtime',
      hypothesisId: 'H1',
      location: 'main.tsx:client',
      message: 'Client-side: actual URL and base path when page loads',
      data: {
        locationHref: window.location.href,
        locationPathname: window.location.pathname,
        baseHref: baseHref,
        scriptSrcs: scripts,
        linkHrefs: links,
        hasCreativeCanvasInPath: window.location.pathname.includes('creative-canvas-portfolio'),
        hasCreativeCanvasInBase: (baseHref || '').includes('creative-canvas-portfolio'),
      },
      timestamp: Date.now(),
    };
    fetch('http://127.0.0.1:7243/ingest/b32c6150-3c17-4e8e-8357-c31558c24e40', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch (_) {}
})();
// #endregion

createRoot(document.getElementById("root")!).render(<App />);
