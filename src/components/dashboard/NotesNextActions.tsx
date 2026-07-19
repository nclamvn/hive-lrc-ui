import { NotebookPen } from "lucide-react";
import type { Messages } from "@/i18n";

type NotesNextActionsProps = {
  messages: Messages;
  notes: string[];
};

/** Deterministic pseudo-random network ornament (seeded LCG — never Math.random). */
function networkPoints(seed: number, count: number, w: number, h: number) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: 10 + rand() * (w - 20),
    y: 8 + rand() * (h - 16),
  }));
}

function NetworkOrnament() {
  const W = 360;
  const H = 170;
  const pts = networkPoints(20260518, 42, W, H);
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      if (dx * dx + dy * dy < 2400) edges.push([i, j]);
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="notes-ornament" aria-hidden="true">
      {edges.map(([i, j], k) => (
        <line
          key={k}
          x1={pts[i].x}
          y1={pts[i].y}
          x2={pts[j].x}
          y2={pts[j].y}
          className="notes-ornament-line"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.6} className="notes-ornament-dot" />
      ))}
    </svg>
  );
}

export function NotesNextActions({ messages, notes }: NotesNextActionsProps) {
  return (
    <section className="card notes-card" aria-label={messages.notes.title} data-testid="notes-card">
      <header className="card-header">
        <span className="card-title-group">
          <NotebookPen className="card-title-icon" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="card-title">{messages.notes.title}</h2>
        </span>
      </header>
      <div className="notes-body">
        <ul className="notes-list">
          {notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
        <NetworkOrnament />
      </div>
    </section>
  );
}
