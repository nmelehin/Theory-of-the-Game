/**
 * Local stub of the Cursor Canvas host module (`cursor/canvas`).
 *
 * In the real Cursor IDE, `cursor/canvas` is injected at runtime by the Canvas
 * renderer. It is NOT an npm package. This file re-implements just enough of the
 * public surface used by the canvas artifacts in `canvases/` so they can be
 * previewed and type-checked outside the editor via Vite.
 *
 * This is a development-only preview shim. It intentionally does not attempt to
 * match Cursor's exact styling — only its API shape and behavior.
 */
import {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ theme -- */

export type HostTheme = {
  accent: { primary: string };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    link: string;
  };
  stroke: { primary: string; secondary: string };
  fill: { secondary: string; tertiary: string };
  bg: { elevated: string };
};

const LIGHT_THEME: HostTheme = {
  accent: { primary: "#4f7cff" },
  text: {
    primary: "#111418",
    secondary: "#3d434d",
    tertiary: "#6b7280",
    quaternary: "#9aa2ad",
    link: "#2f6feb",
  },
  stroke: { primary: "#d7dbe0", secondary: "#c3c9d1" },
  fill: { secondary: "#eef2ff", tertiary: "#e9edf3" },
  bg: { elevated: "#ffffff" },
};

const ThemeContext = createContext<HostTheme>(LIGHT_THEME);

export function useHostTheme(): HostTheme {
  return useContext(ThemeContext);
}

/* --------------------------------------------------------------- canvas state -- */

// Mirrors React's useState signature. In the real host this is persisted to the
// sibling `*.canvas.data.json` file; for local preview an in-memory state is fine.
export function useCanvasState<T>(_key: string, initial: T) {
  return useState<T>(initial);
}

/* ------------------------------------------------------------------- layout -- */

export type DAGLayoutInput = {
  nodes: Array<{ id: string }>;
  edges: Array<{ from: string; to: string }>;
  direction?: "vertical" | "horizontal";
  nodeWidth: number;
  nodeHeight: number;
  rankGap: number;
  nodeGap: number;
  padding: number;
};

export type DAGLayoutNode = { id: string; x: number; y: number };
export type DAGLayoutEdge = {
  from: string;
  to: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isBackEdge: boolean;
};
export type DAGLayout = {
  width: number;
  height: number;
  nodes: DAGLayoutNode[];
  edges: DAGLayoutEdge[];
};

export function computeDAGLayout(input: DAGLayoutInput): DAGLayout {
  const {
    nodes,
    edges,
    nodeWidth,
    nodeHeight,
    rankGap,
    nodeGap,
    padding,
  } = input;

  const ids = nodes.map((n) => n.id);
  const idSet = new Set(ids);
  const adj = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  ids.forEach((id) => {
    adj.set(id, []);
    indeg.set(id, 0);
  });
  edges.forEach((e) => {
    if (!idSet.has(e.from) || !idSet.has(e.to)) return;
    adj.get(e.from)!.push(e.to);
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  });

  // Longest-path ranking via Kahn topological order (DAG assumed).
  const rank = new Map<string, number>();
  ids.forEach((id) => rank.set(id, 0));
  const queue = ids.filter((id) => (indeg.get(id) ?? 0) === 0);
  const workIndeg = new Map(indeg);
  while (queue.length) {
    const u = queue.shift()!;
    for (const v of adj.get(u)!) {
      rank.set(v, Math.max(rank.get(v) ?? 0, (rank.get(u) ?? 0) + 1));
      workIndeg.set(v, (workIndeg.get(v) ?? 0) - 1);
      if ((workIndeg.get(v) ?? 0) === 0) queue.push(v);
    }
  }

  // Group nodes by rank, preserving input order within a rank.
  const byRank = new Map<number, string[]>();
  let maxRank = 0;
  ids.forEach((id) => {
    const r = rank.get(id) ?? 0;
    maxRank = Math.max(maxRank, r);
    if (!byRank.has(r)) byRank.set(r, []);
    byRank.get(r)!.push(id);
  });

  let widest = 0;
  byRank.forEach((row) => {
    const rowWidth = row.length * nodeWidth + (row.length - 1) * nodeGap;
    widest = Math.max(widest, rowWidth);
  });

  const pos = new Map<string, { x: number; y: number }>();
  for (let r = 0; r <= maxRank; r++) {
    const row = byRank.get(r) ?? [];
    const rowWidth = row.length * nodeWidth + (row.length - 1) * nodeGap;
    const startX = padding + (widest - rowWidth) / 2;
    const y = padding + r * (nodeHeight + rankGap);
    row.forEach((id, i) => {
      pos.set(id, { x: startX + i * (nodeWidth + nodeGap), y });
    });
  }

  const layoutNodes: DAGLayoutNode[] = ids.map((id) => ({
    id,
    x: pos.get(id)!.x,
    y: pos.get(id)!.y,
  }));

  const layoutEdges: DAGLayoutEdge[] = edges
    .filter((e) => pos.has(e.from) && pos.has(e.to))
    .map((e) => {
      const s = pos.get(e.from)!;
      const t = pos.get(e.to)!;
      const isBackEdge = (rank.get(e.to) ?? 0) <= (rank.get(e.from) ?? 0);
      return {
        from: e.from,
        to: e.to,
        sourceX: s.x + nodeWidth / 2,
        sourceY: s.y + nodeHeight,
        targetX: t.x + nodeWidth / 2,
        targetY: t.y,
        isBackEdge,
      };
    });

  return {
    width: widest + padding * 2,
    height: padding * 2 + (maxRank + 1) * nodeHeight + maxRank * rankGap,
    nodes: layoutNodes,
    edges: layoutEdges,
  };
}

/* --------------------------------------------------------------- primitives -- */

type Tone = "primary" | "secondary" | "tertiary" | "quaternary" | "link";
type BaseProps = { children?: ReactNode; style?: CSSProperties };

function toneColor(theme: HostTheme, tone?: Tone): string {
  switch (tone) {
    case "primary":
      return theme.text.primary;
    case "tertiary":
      return theme.text.tertiary;
    case "quaternary":
      return theme.text.quaternary;
    case "link":
      return theme.text.link;
    case "secondary":
    default:
      return theme.text.secondary;
  }
}

export function Stack({
  children,
  gap = 0,
  style,
}: BaseProps & { gap?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {children}
    </div>
  );
}

export function Row({
  children,
  gap = 0,
  align,
  wrap,
  style,
}: BaseProps & {
  gap?: number;
  align?: CSSProperties["alignItems"];
  wrap?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap,
        alignItems: align,
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Grid({
  children,
  columns = 1,
  gap = 0,
  style,
}: BaseProps & { columns?: number; gap?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Text({
  children,
  size,
  tone,
  weight,
  style,
}: BaseProps & {
  size?: "small" | "medium" | "large";
  tone?: Tone;
  weight?: "regular" | "medium" | "semibold" | "bold";
}) {
  const theme = useHostTheme();
  const fontSize = size === "small" ? 12.5 : size === "large" ? 18 : 14;
  const fontWeight =
    weight === "semibold"
      ? 600
      : weight === "bold"
        ? 700
        : weight === "medium"
          ? 500
          : 400;
  return (
    <span style={{ color: toneColor(theme, tone), fontSize, fontWeight, ...style }}>
      {children}
    </span>
  );
}

export function H1({ children, style }: BaseProps) {
  const theme = useHostTheme();
  return (
    <h1 style={{ color: theme.text.primary, fontSize: 26, margin: 0, ...style }}>
      {children}
    </h1>
  );
}

export function H2({ children, style }: BaseProps) {
  const theme = useHostTheme();
  return (
    <h2
      style={{ color: theme.text.primary, fontSize: 19, margin: "8px 0 0", ...style }}
    >
      {children}
    </h2>
  );
}

export function H3({ children, style }: BaseProps) {
  const theme = useHostTheme();
  return (
    <h3
      style={{ color: theme.text.primary, fontSize: 15, margin: "4px 0 0", ...style }}
    >
      {children}
    </h3>
  );
}

export function Pill({
  children,
  tone = "neutral",
  size,
}: {
  children?: ReactNode;
  tone?: "neutral" | "info";
  size?: "sm" | "md";
}) {
  const theme = useHostTheme();
  const info = tone === "info";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: size === "sm" ? "1px 8px" : "3px 10px",
        borderRadius: 999,
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 500,
        color: info ? theme.accent.primary : theme.text.tertiary,
        background: info ? theme.fill.secondary : theme.fill.tertiary,
        border: `1px solid ${info ? theme.accent.primary : theme.stroke.primary}`,
      }}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  variant,
  style,
}: BaseProps & { variant?: "default" | "borderless" }) {
  const theme = useHostTheme();
  const borderless = variant === "borderless";
  return (
    <div
      style={{
        background: theme.bg.elevated,
        border: borderless ? "none" : `1px solid ${theme.stroke.primary}`,
        borderRadius: 10,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  trailing,
  style,
}: BaseProps & { trailing?: ReactNode }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: `1px solid ${theme.stroke.primary}`,
        color: theme.text.primary,
        fontWeight: 600,
        fontSize: 14,
        ...style,
      }}
    >
      <span>{children}</span>
      {trailing ? <span>{trailing}</span> : null}
    </div>
  );
}

export function CardBody({ children, style }: BaseProps) {
  return <div style={{ padding: 16, ...style }}>{children}</div>;
}

export function CollapsibleSection({
  children,
  title,
  defaultOpen,
}: BaseProps & { title: ReactNode; defaultOpen?: boolean }) {
  const theme = useHostTheme();
  return (
    <details open={defaultOpen}>
      <summary
        style={{
          cursor: "pointer",
          padding: "8px 4px",
          fontWeight: 600,
          fontSize: 14,
          color: theme.text.primary,
          borderBottom: `1px solid ${theme.stroke.secondary}`,
        }}
      >
        {title}
      </summary>
      <div style={{ padding: "12px 4px" }}>{children}</div>
    </details>
  );
}

export { LIGHT_THEME as defaultHostTheme, ThemeContext as CanvasThemeContext };
