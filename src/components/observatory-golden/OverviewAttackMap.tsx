"use client";

import { useRef, useState } from "react";
import { Plus, Minus, Maximize2, SlidersHorizontal } from "lucide-react";

type Node = { id: string; kind: string; x: number; y: number; label: string; caption?: string };
type Edge = [string, string, string];

const R: Record<string, number> = { "gate-black": 12.5, "gate-current": 16.5, "gate-white": 12.5, "gate-open": 12.5, claim: 6.5, risk: 9.5 };
const EDGE_STYLE: Record<string, { stroke: string; w: number; dash?: string }> = {
  primary: { stroke: "#111", w: 1.4 }, dependency: { stroke: "#cbc8c0", w: 1.2 },
  active: { stroke: "#2f9b50", w: 1.6 }, open: { stroke: "#cbc8c0", w: 1.2, dash: "4 3" }, risk: { stroke: "#d9d6ce", w: 1, dash: "3 3" },
};

function MapNode({ n }: { n: Node }) {
  const r = R[n.kind] ?? 12;
  const black = n.kind === "gate-black", current = n.kind === "gate-current", claim = n.kind === "claim";
  const fill = black ? "#111" : claim ? "#faf9f6" : "#fff";
  const stroke = black ? "#111" : current ? "#2f9b50" : "#cbc8c0";
  const dash = n.kind === "gate-open" ? "3 3" : undefined;
  // claim labels sit ABOVE the small node so they never overflow the border
  if (claim) {
    return (
      <g>
        <text x={n.x} y={n.y - 9.5} textAnchor="middle" fontSize={7.5} fontFamily="ui-monospace, Menlo, monospace" fontWeight="600" fill="#66645f">{n.label}</text>
        <circle cx={n.x} cy={n.y} r={r} fill={fill} stroke={stroke} strokeWidth={1.2} />
      </g>
    );
  }
  // pill for long codes (e.g. C.004) so the text never overflows a circle
  const pill = (n.label?.length ?? 0) >= 4;
  const pw = Math.max(2 * r, (n.label?.length ?? 0) * 5.4 + 11);
  return (
    <g>
      {current && (pill
        ? <rect x={n.x - pw / 2 - 4} y={n.y - r - 4} width={pw + 8} height={2 * r + 8} rx={r + 4} fill="none" stroke="#2f9b50" strokeOpacity=".25" strokeWidth="1.5" />
        : <circle cx={n.x} cy={n.y} r={r + 4} fill="none" stroke="#2f9b50" strokeOpacity=".25" strokeWidth="1.5" />)}
      {pill
        ? <rect x={n.x - pw / 2} y={n.y - r} width={pw} height={2 * r} rx={r} fill={fill} stroke={stroke} strokeWidth={current ? 2 : 1.4} strokeDasharray={dash} />
        : <circle cx={n.x} cy={n.y} r={r} fill={fill} stroke={stroke} strokeWidth={current ? 2 : 1.4} strokeDasharray={dash} />}
      <text x={n.x} y={n.y + 3.2} textAnchor="middle" fontSize={current ? 9 : 8.5} fontFamily="ui-monospace, Menlo, monospace" fontWeight="600" fill={black ? "#fff" : "#111"}>{n.label}</text>
    </g>
  );
}

export function OverviewAttackMap({ nodes, edges, locale }: { nodes: Node[]; edges: Edge[]; locale: string }) {
  const t = (en: string, vi: string) => (locale === "vi" ? vi : en);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const CX = 554, CY = 141; // viewBox center of "42 24 1024 234"
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const zoom = (f: number) => setScale((s) => Math.min(3, Math.max(0.6, +(s * f).toFixed(3))));
  const fit = () => { setScale(1); setPan({ x: 0, y: 0 }); };
  const toggleFullscreen = () => {
    const el = wrapRef.current; if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else (el.requestFullscreen ?? (el as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen)?.call(el);
  };
  const onDown = (e: React.MouseEvent) => { drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; };
  const onMove = (e: React.MouseEvent) => {
    if (!drag.current) return;
    setPan({ x: drag.current.px + (e.clientX - drag.current.x), y: drag.current.py + (e.clientY - drag.current.y) });
  };
  const onUp = () => { drag.current = null; };
  const T = `translate(${pan.x} ${pan.y}) translate(${CX} ${CY}) scale(${scale}) translate(${-CX} ${-CY})`;

  return (
    <div className="og-map" ref={wrapRef} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
         onDoubleClick={fit} style={{ cursor: drag.current ? "grabbing" : "grab" }}>
      <svg viewBox="42 24 1024 234" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="oarw" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="#cbc8c0" /></marker>
          <marker id="oarwG" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="#2f9b50" /></marker>
          <marker id="oarwK" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="#111" /></marker>
        </defs>
        <g transform={T}>
          <rect x="592" y="26" width="196" height="42" rx="8" fill="none" stroke="#cbc8c0" strokeDasharray="4 3" strokeWidth="1" />
          <text x="596" y="22" fontSize="8" letterSpacing="0.5" fill="#8b8881">SUPPORT-4</text>
          <rect x="558" y="210" width="196" height="42" rx="8" fill="none" stroke="#cbc8c0" strokeDasharray="4 3" strokeWidth="1" />
          <text x="562" y="206" fontSize="8" letterSpacing="0.5" fill="#8b8881">RISK &amp; BOTTLENECKS</text>
          {edges.map(([a, b, kind], i) => {
            const s = byId[a], e = byId[b]; if (!s || !e) return null;
            const st = EDGE_STYLE[kind] ?? EDGE_STYLE.dependency;
            const mk = kind === "active" ? "url(#oarwG)" : kind === "primary" ? "url(#oarwK)" : kind === "risk" ? undefined : "url(#oarw)";
            const dx = e.x - s.x, dy = e.y - s.y, Ln = Math.hypot(dx, dy) || 1;
            const rs = (R[s.kind] ?? 12) + 2, re = (R[e.kind] ?? 12) + 4;
            const x1 = s.x + (dx / Ln) * rs, y1 = s.y + (dy / Ln) * rs, x2 = e.x - (dx / Ln) * re, y2 = e.y - (dy / Ln) * re;
            const cy = (y1 + y2) / 2 - (Math.abs(dx) > 40 && Math.abs(dy) > 12 ? 10 : 0);
            return <path key={i} d={`M${x1} ${y1} Q ${(x1 + x2) / 2} ${cy} ${x2} ${y2}`} fill="none" stroke={st.stroke} strokeWidth={st.w} strokeDasharray={st.dash} markerEnd={mk} />;
          })}
          {nodes.map((n) => <MapNode key={n.id} n={n} />)}
          <text x="451" y="150" textAnchor="middle" fontSize="7.5" fill="#66645f">Modular rank repair</text>
          <text x="451" y="160" textAnchor="middle" fontSize="7.5" fill="#8b8881">In progress</text>
        </g>
      </svg>

      <div className="og-map-ctrl" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" aria-label="zoom in" onClick={() => zoom(1.25)}><Plus size={12} strokeWidth={1.6} /></button>
        <button type="button" aria-label="zoom out" onClick={() => zoom(0.8)}><Minus size={12} strokeWidth={1.6} /></button>
        <button type="button" aria-label="fullscreen" title="Fullscreen (double-click map to reset zoom)" onClick={toggleFullscreen}><Maximize2 size={9} strokeWidth={1.6} /></button>
      </div>
      <div className="og-map-view"><SlidersHorizontal size={11} strokeWidth={1.5} /> {t("View options", "Tùy chọn")}</div>
      <div className="og-map-legend">
        <span><i className="act" />{t("Active path", "Đường active")}</span><span><i />{t("Dependency", "Phụ thuộc")}</span><span><i className="open" />{t("Open", "Mở")}</span>
      </div>
      <div className="og-map-hl">
        <div className="og-map-hl-t">{t("Path Highlight", "Đường nổi bật")}</div>
        <div className="og-map-hl-b">{t("Active line D16 → D3 → D4 → D5 traces the current structural front.", "Đường active D16 → D3 → D4 → D5 vẽ mặt trận cấu trúc hiện tại.")}</div>
      </div>
    </div>
  );
}
