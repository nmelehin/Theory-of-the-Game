import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The canvas artifacts import from the virtual module `cursor/canvas`, which is
// provided by the Cursor IDE at runtime. For local preview we alias it to a stub
// that re-implements the host API (see `preview/cursor-canvas.tsx`).
export default defineConfig({
  root: fileURLToPath(new URL("./preview", import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      "cursor/canvas": fileURLToPath(
        new URL("./preview/cursor-canvas.tsx", import.meta.url),
      ),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
