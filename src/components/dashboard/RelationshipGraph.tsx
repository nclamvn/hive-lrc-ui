import { Waypoints } from "lucide-react";
import type { Locale, Messages } from "@/i18n";

type Kind = "proven" | "in_progress" | "open";
interface GNode { id: string; label: string; sub?: string; x: number; y: number; w: number; h: number; tier: 0 | 1 | 2 | 3 | 4; strong?: boolean }
interface GEdge { from: string; to: string; kind: Kind }

/**
 * Premium monochrome relationship diagram. Sharper than the flat dependency
 * chart: layered node depth, arrowheads, and a staggered stroke draw-in that
 * respects prefers-reduced-motion. Coordinates are fixed (no auto-layout) so
 * the picture is deterministic for screenshots.
 */
const NODES: GNode[] = [
  { id: "lrc13", label: "LRC(13)", sub: "14 runners", x: 8, y: 92, w: 96, h: 46, tier: 0, strong: true },
  { id: "upstream", label: "Upstream pipeline", sub: "k ≤ 12", x: 150, y: 30, w: 150, h: 44, tier: 1 },
  { id: "bounds", label: "Combinatorial bounds", sub: "B_k threshold", x: 150, y: 150, w: 150, h: 44, tier: 1 },
  { id: "trace", label: "Traceability", sub: "Gate A · resolved", x: 346, y: 20, w: 150, h: 42, tier: 2 },
  { id: "cert", label: "Certificate layer", sub: "Gate B-C", x: 346, y: 78, w: 150, h: 42, tier: 2 },
  { id: "orbit", label: "Orbit compression", sub: "Gate C.003", x: 346, y: 136, w: 150, h: 42, tier: 2 },
  { id: "analytic", label: "Analytic bridge", sub: "Gate D0-D2", x: 346, y: 194, w: 150, h: 42, tier: 2 },
  { id: "checker", label: "Independent checker", sub: "two verifiers", x: 542, y: 54, w: 150, h: 42, tier: 3 },
  { id: "direct", label: "Direct certificate", sub: "Gate D3 · tight class", x: 542, y: 150, w: 150, h: 42, tier: 3 },
  { id: "attack", label: "Attack k=13", sub: "orbit-bounded", x: 738, y: 92, w: 104, h: 46, tier: 4, strong: true },
];

const EDGES: GEdge[] = [
  { from: "lrc13", to: "upstream", kind: "proven" },
  { from: "lrc13", to: "bounds", kind: "proven" },
  { from: "upstream", to: "trace", kind: "proven" },
  { from: "upstream", to: "cert", kind: "in_progress" },
  { from: "bounds", to: "orbit", kind: "proven" },
  { from: "bounds", to: "analytic", kind: "in_progress" },
  { from: "trace", to: "checker", kind: "proven" },
  { from: "cert", to: "checker", kind: "in_progress" },
  { from: "orbit", to: "direct", kind: "proven" },
  { from: "analytic", to: "direct", kind: "in_progress" },
  { from: "checker", to: "attack", kind: "in_progress" },
  { from: "direct", to: "attack", kind: "open" },
];

const EDGE_CLASS: Record<Kind, string> = { proven: "rg-proven", in_progress: "rg-progress", open: "rg-open" };

export function RelationshipGraph({
  locale,
  messages,
  variant = "overview",
}: {
  locale: Locale;
  messages?: Messages;
  variant?: "overview" | "wiki";
}) {
  const byId = new Map(NODES.map((n) => [n.id, n]));
  const VB_W = 850;
  const VB_H = 250;
  const title = messages?.graph.title ?? (locale === "vi" ? "Đồ thị quan hệ chứng minh" : "Proof relationship graph");
  const legend = locale === "vi"
    ? { proven: "Đã thỏa", progress: "Đang thực hiện", open: "Đang mở" }
    : { proven: "Satisfied", progress: "In progress", open: "Open" };

  let order = 0;
  return (
    <section className={`card relationship-graph rg-${variant}`} aria-label={title} data-testid="dependency-graph">
      <header className="card-header">
        <span className="card-title-group">
          <Waypoints className="card-title-icon" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="card-title">{title}</h2>
        </span>
        <div className="rg-legend" aria-hidden="true">
          {(["proven", "progress", "open"] as const).map((k) => (
            <span key={k} className="rg-legend-item">
              <svg viewBox="0 0 26 6" className="rg-legend-line" aria-hidden="true">
                <line x1="1" y1="3" x2="25" y2="3" className={k === "proven" ? "rg-proven" : k === "progress" ? "rg-progress" : "rg-open"} />
              </svg>
              {legend[k]}
            </span>
          ))}
        </div>
      </header>

      <svg className="rg-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={title} preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="rg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,1 L9,5 L0,9" className="rg-arrowhead" fill="none" />
          </marker>
          <marker id="rg-arrow-strong" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse">
            <path d="M0,1 L9,5 L0,9" className="rg-arrowhead-strong" fill="none" />
          </marker>
          <filter id="rg-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.10" />
          </filter>
        </defs>

        {/* edges (draw-in staggered) */}
        {EDGES.map((e, i) => {
          const a = byId.get(e.from)!;
          const b = byId.get(e.to)!;
          const x1 = a.x + a.w, y1 = a.y + a.h / 2;
          const x2 = b.x, y2 = b.y + b.h / 2;
          const mx = (x1 + x2) / 2;
          const strong = a.strong || b.strong;
          const delay = (order++ * 55);
          return (
            <path
              key={i}
              d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2 - 3},${y2}`}
              className={`rg-edge ${EDGE_CLASS[e.kind]}`}
              style={{ ["--rg-delay" as string]: `${delay}ms` }}
              markerEnd={`url(#${strong ? "rg-arrow-strong" : "rg-arrow"})`}
              vectorEffect="non-scaling-stroke"
              fill="none"
            />
          );
        })}

        {/* nodes */}
        {NODES.map((n, i) => (
          <g key={n.id} className={`rg-node${n.strong ? " rg-node-strong" : ""}`} data-node-id={n.id} tabIndex={0}
             style={{ ["--rg-delay" as string]: `${i * 45}ms` }}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={9} className="rg-node-box" filter="url(#rg-shadow)" />
            {n.strong && <rect x={n.x + 3} y={n.y + 3} width={n.w - 6} height={n.h - 6} rx={6} className="rg-node-inner" />}
            <text x={n.x + n.w / 2} y={n.y + (n.sub ? n.h / 2 - 3 : n.h / 2 + 4)} textAnchor="middle" className={`rg-node-label${n.strong ? " rg-node-label-strong" : ""}`}>
              {n.label}
            </text>
            {n.sub && (
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 12} textAnchor="middle" className="rg-node-sub">
                {n.sub}
              </text>
            )}
          </g>
        ))}
      </svg>

      <ul className="visually-hidden" aria-label="Dependency nodes">
        {NODES.map((n) => <li key={n.id}>{n.label}{n.sub ? `, ${n.sub}` : ""}</li>)}
      </ul>
    </section>
  );
}
