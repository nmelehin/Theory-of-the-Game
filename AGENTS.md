# Theory of the Game

Notes and interactive materials on consciousness/philosophy. The only "code" is
Cursor Canvas artifacts in `canvases/` (`*.canvas.tsx`).

## Cursor Cloud specific instructions

- These artifacts import from the virtual module `cursor/canvas`, which is
  provided by the Cursor IDE's built-in Canvas renderer at runtime. It is **not**
  an npm package, so the artifacts cannot be rendered standalone as-is.
- A local preview harness lives in `preview/` and re-implements just enough of the
  `cursor/canvas` host API to preview and type-check the artifacts outside the
  editor. `vite.config.ts` aliases `cursor/canvas` to `preview/cursor-canvas.tsx`,
  and the root `tsconfig.json` maps the same via `paths`. The `preview/` harness is
  a dev-only shim — do not treat it as the real host or ship it as product code.
- Do not edit the existing `canvases/tsconfig.json` (Cursor uses it); type-checking
  for dev tooling is driven by the root `tsconfig.json` instead.
- Commands (see `package.json`): `npm run dev` (Vite preview at
  http://localhost:5173), `npm run typecheck` / `npm run lint` (both `tsc --noEmit`;
  there is no ESLint config), `npm run build`, `npm run preview`.
- Core functionality to sanity-check a canvas: load the preview, click nodes in the
  SVG mind map and confirm the detail card below updates (selection state), and
  toggle a collapsible section. Node selection uses `useCanvasState`; in-editor this
  persists to the sibling `*.canvas.data.json`, but the preview shim keeps it in
  memory only.
