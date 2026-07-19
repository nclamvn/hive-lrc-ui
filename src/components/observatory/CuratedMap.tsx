"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { GraphNode, GraphEdge, Locale } from "@/lib/observatory";
import { pick } from "@/lib/observatory";

type Props = { nodes: GraphNode[]; edges: GraphEdge[]; locale: Locale };
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);

const INK = "#111111", DIM = "#66645f", LINE = "#cbc8c0", SOFT = "#e9e7e1", PAPER = "#fffefc", ACCENT = "#2f9b50", RUST = "#a08f7a";

// hand-tuned claim layout: [column, lane]  (lane 0=upper, 1=mid, 2=lower)
const CLAIM_POS: Record<string, [number, number]> = {
  C1: [0, 0], C2: [0, 2],
  "C-D4-K13-P191": [1, 2], "C-D5-UNIFORM": [2, 2],
  "C-D12-DEFICIT-IDENTITY": [3, 2],
  "C-D13-SUPPORT3-INVERSE-SCOPED": [4, 2],
  "C-D14-PURITY-LEMMA": [5, 2],
  "C-D14-SUPPORT3-TAIL": [6, 0], "C-D15-ORBIT-IDENTITY": [6, 2],
  "C-D15-SUPPORT3-INVENTORY": [7, 0], "C-D16-MODULAR-RANK": [7, 2],
  "C-D16-SUPPORT3-COMPLETE": [8, 1], "C-D16-SUPPORT4-FRAMEWORK": [9, 1],
  C0: [10, 1],
};
// short readable label per claim (drawer shows the full statement)
const CLAIM_TAG: Record<string, [string, string]> = {
  C0: ["LRC(13)", "LRC(13)"], C1: ["k ≤ 12", "k ≤ 12"], C2: ["k = 9", "k = 9"],
  "C-D4-K13-P191": ["Tight count", "Đếm tight"], "C-D5-UNIFORM": ["Uniform prime", "Prime đều"],
  "C-D12-DEFICIT-IDENTITY": ["Deficit identity", "Danh tính deficit"],
  "C-D13-SUPPORT3-INVERSE-SCOPED": ["Support-3 inverse", "Support-3 inverse"],
  "C-D14-PURITY-LEMMA": ["Purity lemma", "Bổ đề thuần khiết"],
  "C-D14-SUPPORT3-TAIL": ["Tail 9/1000", "Đuôi 9/1000"],
  "C-D15-ORBIT-IDENTITY": ["Orbit identity", "Danh tính quỹ đạo"],
  "C-D15-SUPPORT3-INVENTORY": ["Tail 1/100", "Đuôi 1/100"],
  "C-D16-MODULAR-RANK": ["Modular rank", "Hạng modular"],
  "C-D16-SUPPORT3-COMPLETE": ["Support-3 complete", "Support-3 đầy đủ"],
  "C-D16-SUPPORT4-FRAMEWORK": ["Support-4 framework", "Support-4 framework"],
};
const LANE_Y = [196, 286, 372];
const EDGE: Record<string, { c: string; w: number; dash?: string }> = {
  supports: { c: DIM, w: 1.3 }, depends_on: { c: LINE, w: 1.2 }, reduces_to: { c: DIM, w: 1.3 },
  verifies: { c: ACCENT, w: 1.5 }, supersedes: { c: RUST, w: 1.4, dash: "5 4" },
  refutes: { c: INK, w: 1.3, dash: "3 3" }, generalizes: { c: DIM, w: 1.2 },
};

export function CuratedMap({ nodes, edges, locale }: Props) {
  const [sel, setSel] = useState<GraphNode | null>(null);
  const [focus, setFocus] = useState(false);
  const [showClaims, setShowClaims] = useState(true);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const { pos, gateSeq, claimList, VW, VH, CX, CY } = useMemo(() => {
    const gates = nodes.filter((n) => n.kind === "gate");
    const claims = nodes.filter((n) => n.kind === "claim");
    const pos: Record<string, { x: number; y: number; n: GraphNode }> = {};
    const step = gates.length > 1 ? Math.min(64, (1470 - 96) / (gates.length - 1)) : 64;
    gates.forEach((n, i) => { pos[n.id] = { x: 96 + i * step, y: 62, n }; });
    claims.forEach((n) => {
      const cp = CLAIM_POS[n.id.split(":")[1]];
      if (cp) pos[n.id] = { x: 150 + cp[0] * 140, y: LANE_Y[cp[1]], n };
    });
    const VW = 1680, VH = 440;   /* wide enough that the rightmost claim (LRC(13), right edge ~1606) fits with margin */
    return { pos, gateSeq: gates, claimList: claims, VW, VH, CX: VW / 2, CY: VH / 2 };
  }, [nodes]);

  const adj = useMemo(() => {
    const succ: Record<string, string[]> = {}, pred: Record<string, string[]> = {};
    edges.forEach((e) => { (succ[e.source] ??= []).push(e.target); (pred[e.target] ??= []).push(e.source); });
    return { succ, pred };
  }, [edges]);

  const highlight = useMemo(() => {
    if (!focus || !sel) return null;
    const seen = new Set<string>([sel.id]);
    const walk = (id: string, m: Record<string, string[]>) => { for (const nx of m[id] ?? []) if (!seen.has(nx)) { seen.add(nx); walk(nx, m); } };
    walk(sel.id, adj.succ); walk(sel.id, adj.pred);
    return seen;
  }, [focus, sel, adj]);

  const dimmed = (id: string) => (highlight ? !highlight.has(id) : false);
  const T = `translate(${pan.x} ${pan.y}) translate(${CX} ${CY}) scale(${scale}) translate(${-CX} ${-CY})`;

  const zoom = (f: number) => setScale((s) => Math.min(2.6, Math.max(0.55, +(s * f).toFixed(3))));
  const reset = () => { setScale(1); setPan({ x: 0, y: 0 }); };
  const fullscreen = () => { const el = stageRef.current; if (!el) return; if (document.fullscreenElement) document.exitFullscreen?.(); else el.requestFullscreen?.(); };
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.12 : 0.9); };
  const onDown = (e: React.MouseEvent) => { drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false }; };
  const onMove = (e: React.MouseEvent) => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true; setPan({ x: drag.current.px + dx, y: drag.current.py + dy }); };
  const onUp = () => { drag.current = null; };
  const onBgClick = () => { if (!drag.current?.moved) setSel(null); };

  // gate node label (D16, S, A…) and shape
  const gateLabel = (n: GraphNode) => pick(n.short_label, locale).replace(/^GATE\s+/i, "").replace(/^SCAN$/i, "S");
  const gateFill = (s: string) => (["pass", "proved_internal"].includes(s) ? INK : s === "blocked" ? PAPER : PAPER);

  return (
    <div className="rm-wrap">
      <div className="rm-bar">
        <button className="rm-chipbtn" data-on={focus} onClick={() => setFocus((f) => !f)}>{t(locale, "Focus mode", "Chế độ tập trung")}</button>
        <span className="rm-sep" />
        <button className="rm-chipbtn" data-on onClick={() => {}}>{t(locale, "gates", "gate")}</button>
        <button className="rm-chipbtn" data-on={showClaims} onClick={() => setShowClaims((v) => !v)}>{t(locale, "claims", "claim")}</button>
        <div className="rm-legend">
          <span className="rm-lg"><i style={{ background: INK }} />{t(locale, "proved", "chứng minh")}</span>
          <span className="rm-lg"><i style={{ background: SOFT, border: `1px solid ${DIM}` }} />{t(locale, "supported", "có cơ sở")}</span>
          <span className="rm-lg"><i style={{ background: PAPER, border: `1px dashed ${LINE}` }} />{t(locale, "superseded", "đã thay")}</span>
          <span className="rm-lg"><i style={{ borderTop: `2px solid ${ACCENT}`, height: 0, width: 12 }} />{t(locale, "verified", "kiểm")}</span>
          <span className="rm-lg"><i style={{ borderTop: `2px dashed ${RUST}`, height: 0, width: 12 }} />{t(locale, "supersedes", "thay thế")}</span>
        </div>
      </div>

      <div className="rm-stage" ref={stageRef}>
        <div className="rm-canvas" role="application" aria-label="Research attack map"
             onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onClick={onBgClick} onWheel={onWheel}
             style={{ cursor: drag.current ? "grabbing" : "grab" }}>
          <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <marker id="cm-a" markerWidth="7" markerHeight="7" refX="6" refY="3.2" orient="auto"><path d="M0 0L7 3.2L0 6.4z" fill={LINE} /></marker>
              <marker id="cm-ag" markerWidth="7" markerHeight="7" refX="6" refY="3.2" orient="auto"><path d="M0 0L7 3.2L0 6.4z" fill={ACCENT} /></marker>
              <marker id="cm-ar" markerWidth="7" markerHeight="7" refX="6" refY="3.2" orient="auto"><path d="M0 0L7 3.2L0 6.4z" fill={RUST} /></marker>
            </defs>
            <g transform={T}>
              {/* gate timeline rail */}
              <polyline points={gateSeq.map((n) => `${pos[n.id].x},${pos[n.id].y}`).join(" ")} fill="none" stroke={LINE} strokeWidth="1" opacity="0.7" />
              {/* claim -> introducing gate faint connectors */}
              {showClaims && claimList.map((n) => {
                const p = pos[n.id]; const g = pos[`gate:${n.gate}`]; if (!p || !g) return null;
                return <path key={`c-${n.id}`} d={`M${p.x} ${p.y - 15} C ${p.x} ${(p.y + g.y) / 2}, ${g.x} ${(p.y + g.y) / 2}, ${g.x} ${g.y + 15}`} fill="none" stroke={LINE} strokeWidth="0.8" strokeDasharray="2 3" opacity={dimmed(n.id) ? 0.06 : 0.3} />;
              })}
              {/* claim dependency edges */}
              {showClaims && edges.map((e) => {
                const s = pos[e.source], d = pos[e.target]; if (!s || !d) return null;
                if (pos[e.source].n.kind !== "claim" || pos[e.target].n.kind !== "claim") return null;
                const st = EDGE[e.relation] ?? EDGE.supports;
                const mk = e.relation === "verifies" ? "url(#cm-ag)" : e.relation === "supersedes" ? "url(#cm-ar)" : "url(#cm-a)";
                const mx = (s.x + d.x) / 2, my = (s.y + d.y) / 2 - (Math.abs(s.y - d.y) < 8 ? 16 : 0);
                const op = dimmed(e.source) || dimmed(e.target) ? 0.08 : 0.9;
                return <path key={e.id} d={`M${s.x + 58} ${s.y} Q ${mx} ${my} ${d.x - 58} ${d.y}`} fill="none" stroke={st.c} strokeWidth={st.w} strokeDasharray={st.dash} markerEnd={mk} opacity={op} />;
              })}
              {/* gate nodes (circle for short codes, pill for long codes like C.004 so text never overflows) */}
              {gateSeq.map((n) => {
                const p = pos[n.id]; const cur = n.status === "current"; const blk = gateFill(n.status) === INK;
                const label = gateLabel(n); const stroke = cur ? ACCENT : n.status === "pass" ? INK : DIM;
                const pill = label.length >= 4;
                const pw = Math.max(29, label.length * 6 + 14);
                return (
                  <g key={n.id} style={{ cursor: "pointer" }} opacity={dimmed(n.id) ? 0.18 : 1}
                     onClick={(ev) => { ev.stopPropagation(); setSel(n); }}>
                    {cur && (pill
                      ? <rect x={p.x - pw / 2 - 4.5} y={p.y - 18.5} width={pw + 9} height={37} rx={18.5} fill="none" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="1.6" />
                      : <circle cx={p.x} cy={p.y} r="19" fill="none" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="1.6" />)}
                    {pill
                      ? <rect x={p.x - pw / 2} y={p.y - 14.5} width={pw} height={29} rx={14.5} fill={gateFill(n.status)} stroke={stroke} strokeWidth={cur ? 2 : 1.4} />
                      : <circle cx={p.x} cy={p.y} r="14.5" fill={gateFill(n.status)} stroke={stroke} strokeWidth={cur ? 2 : 1.4} />}
                    <text x={p.x} y={p.y + 3.4} textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, Menlo, monospace" fontWeight="600" fill={blk ? "#fff" : "#1a1a1a"}>{label}</text>
                  </g>
                );
              })}
              {/* claim nodes */}
              {showClaims && claimList.map((n) => {
                const p = pos[n.id]; if (!p) return null;
                const cid = n.id.split(":")[1]; const tag = CLAIM_TAG[cid] ?? [cid, cid];
                const proved = ["proved_internal", "validated_exact"].includes(n.status);
                const superseded = n.status === "superseded"; const target = cid === "C0";
                const fill = target ? PAPER : proved ? INK : superseded ? PAPER : SOFT;
                const stroke = target ? INK : proved ? INK : superseded ? LINE : DIM;
                return (
                  <g key={n.id} style={{ cursor: "pointer" }} opacity={dimmed(n.id) ? 0.16 : 1}
                     onClick={(ev) => { ev.stopPropagation(); setSel(n); }}>
                    <rect x={p.x - 56} y={p.y - 14} width="112" height="28" rx={target ? 14 : 7}
                          fill={fill} stroke={stroke} strokeWidth={target ? 1.6 : 1.3} strokeDasharray={superseded ? "4 3" : undefined} />
                    <text x={p.x} y={p.y + 3.2} textAnchor="middle" fontSize="9" fontWeight="600"
                          fill={proved ? "#fff" : "#1a1a1a"} opacity={superseded ? 0.7 : 1}>{pick({ en: tag[0], vi: tag[1] }, locale)}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div className="rm-ctrl">
          <button aria-label="zoom in" onClick={() => zoom(1.25)}>+</button>
          <button aria-label="zoom out" onClick={() => zoom(0.8)}>−</button>
          <button aria-label="fit" onClick={reset} title={t(locale, "Reset", "Đặt lại")}>▣</button>
          <button aria-label="fullscreen" onClick={fullscreen} title={t(locale, "Fullscreen", "Toàn màn hình")}>⤢</button>
        </div>

        {sel && (
          <div className="rm-drawer">
            <span className="rm-drawer-id">{sel.id.split(":")[1]} · {sel.kind} · {sel.status}</span>
            <div className="rm-drawer-title">{pick(sel.label, locale)}</div>
            <div className="rm-drawer-body">{pick(sel.summary, locale)}</div>
            <div className="og-audit rm-drawer-tech">{pick(sel.technical_summary, locale)} · {sel.scope}</div>
            <Link href={`/${locale}/observatory${sel.route}`} className="rm-open">{t(locale, "Open →", "Mở →")}</Link>
          </div>
        )}
      </div>

      <div className="rm-hint">{t(locale, "Drag to pan · scroll/±  to zoom · tap a node to inspect · Focus mode isolates its ancestors and descendants.", "Kéo để di chuyển · cuộn/±  để zoom · chạm node để xem · Chế độ tập trung cô lập tổ tiên và hậu duệ.")}</div>
    </div>
  );
}
