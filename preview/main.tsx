/**
 * Local preview entrypoint. Mounts a Cursor Canvas artifact into a plain browser
 * page using the `cursor/canvas` host stub (wired up via the Vite alias in
 * `vite.config.ts`). This is for local development/preview only — inside Cursor
 * the artifact is rendered by the built-in Canvas host instead.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UniversalConsciousnessMindmap from "../canvases/universal-consciousness-mindmap.canvas";

const el = document.getElementById("root");
if (!el) throw new Error("#root not found");

createRoot(el).render(
  <StrictMode>
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <UniversalConsciousnessMindmap />
    </div>
  </StrictMode>,
);
