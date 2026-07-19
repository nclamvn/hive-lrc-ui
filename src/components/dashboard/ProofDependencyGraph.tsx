import { Waypoints } from "lucide-react";
import type { Messages } from "@/i18n";
import type { GraphNodeVM, GraphEdgeVM } from "@/data/adapters/researchOverviewAdapter";

type ProofDependencyGraphProps = {
  messages: Messages;
  nodes: GraphNodeVM[];
  edges: GraphEdgeVM[];
};

const EDGE_CLASS: Record<GraphEdgeVM["kind"], string> = {
  proven: "edge-proven",
  in_progress: "edge-progress",
  open: "edge-open",
};

/** Fixed-coordinate SVG — no auto-layout in the golden view (TIP §12.8). */
export function ProofDependencyGraph({ messages, nodes, edges }: ProofDependencyGraphProps) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const VB_W = 780;
  const VB_H = 122;

  return (
    <section
      className="card dependency-graph"
      aria-label={messages.graph.title}
      data-testid="dependency-graph"
    >
      <header className="card-header">
        <span className="card-title-group">
          <Waypoints className="card-title-icon" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="card-title">{messages.graph.title}</h2>
        </span>
      </header>
      <div className="graph-legend" aria-hidden="true">
          <span className="graph-legend-item">
            <svg viewBox="0 0 28 2" className="graph-legend-line">
              <line x1="0" y1="1" x2="28" y2="1" className="edge-proven" />
            </svg>
            {messages.graph.proven}
          </span>
          <span className="graph-legend-item">
            <svg viewBox="0 0 28 2" className="graph-legend-line">
              <line x1="0" y1="1" x2="28" y2="1" className="edge-progress" />
            </svg>
            {messages.graph.progress}
          </span>
          <span className="graph-legend-item">
            <svg viewBox="0 0 28 2" className="graph-legend-line">
              <line x1="0" y1="1" x2="28" y2="1" className="edge-open" />
            </svg>
            {messages.graph.open}
          </span>
        </div>

      <svg
        className="graph-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label={messages.graph.title}
        preserveAspectRatio="xMidYMid meet"
      >
        {edges.map((e, i) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          const x1 = a.x + a.w;
          const y1 = a.y + a.h / 2;
          const x2 = b.x;
          const y2 = b.y + b.h / 2;
          const mx = (x1 + x2) / 2;
          return (
            <path
              key={i}
              d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
              className={`graph-edge ${EDGE_CLASS[e.kind]}`}
              vectorEffect="non-scaling-stroke"
              fill="none"
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id} className={`graph-node${n.emphasis ? " graph-node-strong" : ""}`} data-node-id={n.id} tabIndex={0}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={8} className="graph-node-box" />
            {n.lines.map((line, li) => (
              <text
                key={li}
                x={n.x + n.w / 2}
                y={n.y + n.h / 2 + (n.lines.length === 1 ? 3 : li === 0 ? -3 : 9)}
                textAnchor="middle"
                className={`graph-node-text${n.emphasis ? " graph-node-text-strong" : ""}`}
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>

      {/* screen-reader fallback list */}
      <ul className="visually-hidden" aria-label={messages.graph.nodeList}>
        {nodes.map((n) => (
          <li key={n.id}>{n.lines.join(" ")}</li>
        ))}
      </ul>
    </section>
  );
}
