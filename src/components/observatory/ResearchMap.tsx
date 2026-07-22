"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import cytoscapeDagre from "cytoscape-dagre";
import type { GraphNode, GraphEdge, Locale } from "@/lib/observatory";
import { pick } from "@/lib/observatory";

type Props = { nodes: GraphNode[]; edges: GraphEdge[]; locale: Locale };
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);

// warm monochrome palette + single green accent (matches the golden design).
// Cytoscape cannot read CSS custom properties, so the palette is picked once
// from the active theme. INK is the emphasis fill; text on it is ON_INK.
const DARK = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";
const INK = DARK ? "#ece9e1" : "#111111",
  DIM = DARK ? "#8a877e" : "#66645f",
  LINE = DARK ? "#4f4c44" : "#cbc8c0",
  SOFT = DARK ? "#3a3833" : "#e9e7e1",
  PAPER = DARK ? "#211f1a" : "#fffefc",
  ACCENT = DARK ? "#4fb96e" : "#2f9b50",
  ON_INK = DARK ? "#100f0d" : "#fff",       // label sitting on an INK-filled node
  ON_NODE = DARK ? "#ece9e1" : "#1a1a1a";   // label on SOFT / PAPER nodes
let dagreRegistered = false;

function fill(status: string): string {
  if (["proved_internal", "pass", "two_verifiers_accept"].includes(status)) return INK;
  if (["supported_internal", "supported_conditional", "partial", "current", "validated_exact", "validated_bounded"].includes(status)) return SOFT;
  return PAPER;
}
function border(status: string): { color: string; width: number; style: string } {
  if (status === "superseded") return { color: LINE, width: 1, style: "dashed" };
  if (["provisional", "pending"].includes(status)) return { color: INK, width: 1.5, style: "dotted" };
  if (["refuted", "blocked"].includes(status)) return { color: INK, width: 2, style: "double" };
  if (["proved_internal", "pass"].includes(status)) return { color: INK, width: 1.8, style: "solid" };
  if (status === "current") return { color: ACCENT, width: 2, style: "solid" };
  return { color: DIM, width: 1.4, style: "solid" };
}
const shape = (kind: string) => kind === "gate" ? "ellipse" : kind === "artifact" ? "round-hexagon" : kind === "risk" ? "round-triangle" : "round-rectangle";
// compact node label: gates keep their code; claims/artifacts show a short tag
function nodeLabel(n: GraphNode, locale: Locale): string {
  if (n.kind === "gate") return pick(n.short_label, locale).replace(/^GATE\s+/i, "").replace(/^SCAN$/i, "S");
  const id = n.id.split(":")[1] ?? pick(n.short_label, locale);
  return id.replace(/^C-?/, "").replace(/-/g, "-​"); // allow wrapping on hyphens
}

export function ResearchMap({ nodes, edges, locale }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const cyRef = useRef<unknown>(null);
  const [sel, setSel] = useState<GraphNode | null>(null);
  const [focus, setFocus] = useState(false);
  const [kinds, setKinds] = useState<Record<string, boolean>>({ gate: true, claim: true, artifact: false });

  useEffect(() => {
    let cy: any;
    let disposed = false;
    (async () => {
      const mod: any = await import("cytoscape");
      const cytoscape: any = mod.default ?? mod;
      if (!dagreRegistered) { try { cytoscape.use(cytoscapeDagre); } catch { /* already registered */ } dagreRegistered = true; }
      if (disposed || !ref.current) return;
      const nodeIds = new Set(nodes.map((n) => n.id));
      // synthetic edges attaching each artifact to its source gate, so artifacts never float
      const artEdges = nodes
        .filter((n) => n.kind === "artifact" && n.gate && nodeIds.has(`gate:${n.gate}`))
        .map((n) => ({ data: { id: `art-${n.id}`, source: n.id, target: `gate:${n.gate}`, relation: "belongs" } }));
      const els = [
        ...nodes.map((n) => ({ data: { id: n.id, label: nodeLabel(n, locale), kind: n.kind, status: n.status, raw: n } })),
        ...edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target)).map((e) => ({ data: { id: e.id, source: e.source, target: e.target, relation: e.relation } })),
        ...artEdges,
      ];
      cy = cytoscape({
        container: ref.current,
        elements: els,
        wheelSensitivity: 0.25,
        minZoom: 0.25, maxZoom: 2.4,
        style: [
          { selector: "node", style: {
            "background-color": (n: any) => fill(n.data("status")),
            "border-color": (n: any) => border(n.data("status")).color,
            "border-width": (n: any) => border(n.data("status")).width,
            "border-style": (n: any) => border(n.data("status")).style,
            "shape": (n: any) => shape(n.data("kind")),
            "label": "data(label)",
            "font-size": (n: any) => (n.data("kind") === "gate" ? 11 : 9),
            "font-family": "ui-monospace, SFMono-Regular, Menlo, monospace",
            "font-weight": 600,
            "color": (n: any) => (fill(n.data("status")) === INK ? ON_INK : ON_NODE),
            "text-valign": "center", "text-halign": "center",
            "text-max-width": (n: any) => (n.data("kind") === "gate" ? "48px" : "104px"),
            "text-wrap": "wrap",
            "width": (n: any) => (n.data("kind") === "gate" ? 46 : n.data("kind") === "claim" ? 116 : 40),
            "height": (n: any) => (n.data("kind") === "gate" ? 46 : n.data("kind") === "claim" ? 34 : 40),
            "padding": "3px",
            "transition-property": "border-width, border-color, opacity",
            "transition-duration": "120ms" as any,
          } },
          { selector: "edge", style: {
            "width": 1.1, "line-color": LINE, "target-arrow-color": LINE,
            "target-arrow-shape": "triangle", "arrow-scale": 0.85,
            "curve-style": "bezier", "control-point-step-size": 34,
            "line-style": (e: any) => (["supersedes", "open"].includes(e.data("relation")) ? "dashed" : "solid"),
          } },
          { selector: "edge[relation = 'supports']", style: { "line-color": DIM, "target-arrow-color": DIM } },
          { selector: "edge[relation = 'verifies']", style: { "line-color": ACCENT, "target-arrow-color": ACCENT, "width": 1.4 } },
          { selector: "edge[relation = 'refutes']", style: { "line-color": INK, "target-arrow-color": INK, "line-style": "dashed" } },
          { selector: "edge[relation = 'supersedes']", style: { "line-color": "#a08f7a", "target-arrow-color": "#a08f7a" } },
          { selector: "edge[relation = 'belongs']", style: { "line-color": SOFT, "target-arrow-color": SOFT, "line-style": "dotted", "width": 0.9, "target-arrow-shape": "none" } },
          { selector: ".faded", style: { "opacity": 0.1 } },
          { selector: ".hi", style: { "border-color": ACCENT, "border-width": 3 } },
        ] as any,
        layout: { name: "dagre", rankDir: "LR", nodeSep: 40, rankSep: 96, edgeSep: 14, ranker: "tight-tree", animate: false, padding: 30, fit: true } as any,
      });
      const applyVisibility = () => cy.batch(() => {
        cy.nodes().forEach((n: any) => n.style("display", kinds[n.data("kind")] === false ? "none" : "element"));
        cy.edges().forEach((e: any) => {
          const h = kinds[e.source().data("kind")] === false || kinds[e.target().data("kind")] === false;
          e.style("display", h ? "none" : "element");
        });
      });
      const settle = () => { applyVisibility(); cy.fit(cy.elements(":visible"), 28); if (cy.zoom() > 1.5) cy.zoom(1.35); cy.center(); };
      cy.ready(settle);
      setTimeout(() => { if (!disposed) settle(); }, 140);
      cy.on("tap", "node", (evt: any) => {
        const raw = evt.target.data("raw") as GraphNode;
        setSel(raw);
        cy.elements().removeClass("faded hi");
        if (focus) applyFocus(cy, evt.target);
        else evt.target.addClass("hi");
      });
      cy.on("tap", (evt: any) => { if (evt.target === cy) { setSel(null); cy.elements().removeClass("faded hi"); } });
      cyRef.current = cy;
    })();
    return () => { disposed = true; if (cy) cy.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, locale]);

  function applyFocus(cy: any, node: any) {
    const nhood = node.closedNeighborhood().union(node.predecessors()).union(node.successors());
    cy.elements().addClass("faded");
    nhood.removeClass("faded").addClass("hi");
    node.removeClass("faded");
  }

  useEffect(() => {
    const cy: any = cyRef.current;
    if (!cy) return;
    cy.batch(() => {
      cy.nodes().forEach((n: any) => n.style("display", kinds[n.data("kind")] === false ? "none" : "element"));
      cy.edges().forEach((e: any) => {
        const hidden = kinds[e.source().data("kind")] === false || kinds[e.target().data("kind")] === false;
        e.style("display", hidden ? "none" : "element");
      });
    });
    setTimeout(() => { cy.fit(cy.elements(":visible"), 28); if (cy.zoom() > 1.5) cy.zoom(1.35); cy.center(); }, 20);
  }, [kinds]);

  const toggleKind = (k: string) => setKinds((s) => ({ ...s, [k]: !s[k] }));
  const fit = () => { const cy: any = cyRef.current; if (cy) { cy.fit(cy.elements(":visible"), 28); cy.center(); } };
  const zoom = (f: number) => { const cy: any = cyRef.current; if (cy) cy.zoom({ level: Math.min(2.4, Math.max(0.25, cy.zoom() * f)), renderedPosition: { x: (ref.current?.clientWidth ?? 0) / 2, y: (ref.current?.clientHeight ?? 0) / 2 } }); };
  const fullscreen = () => { const el = ref.current?.parentElement; if (!el) return; if (document.fullscreenElement) document.exitFullscreen?.(); else el.requestFullscreen?.(); };

  const LEGEND: [string, string, string][] = [
    ["proved", "chứng minh", "obs-tok-proved"], ["validated", "thẩm định", "obs-tok-validated"],
    ["supported", "có cơ sở", "obs-tok-supported"], ["superseded", "đã thay", "obs-tok-superseded"], ["open", "mở", "obs-tok-open"],
  ];

  return (
    <div className="rm-wrap">
      <div className="rm-bar">
        <button className="rm-chipbtn" data-on={focus} onClick={() => setFocus((f) => !f)}>{t(locale, "Focus mode", "Chế độ tập trung")}</button>
        <span className="rm-sep" />
        {(["gate", "claim", "artifact"] as const).map((k) => (
          <button key={k} className="rm-chipbtn" data-on={kinds[k]} onClick={() => toggleKind(k)}>{t(locale, k, k === "gate" ? "gate" : k === "claim" ? "claim" : "artifact")}</button>
        ))}
        <div className="rm-legend">
          {LEGEND.map(([en, vi, tok]) => <span key={en} className={`obs-chip ${tok}`} style={{ fontSize: 10 }}>{t(locale, en, vi)}</span>)}
        </div>
      </div>
      <div className="rm-stage">
        <div className="rm-canvas" ref={ref} role="application" aria-label="Research attack map" />
        <div className="rm-ctrl">
          <button aria-label="zoom in" onClick={() => zoom(1.25)}>+</button>
          <button aria-label="zoom out" onClick={() => zoom(0.8)}>−</button>
          <button aria-label="fit" onClick={fit} title={t(locale, "Fit", "Vừa khung")}>▣</button>
          <button aria-label="fullscreen" onClick={fullscreen} title={t(locale, "Fullscreen", "Toàn màn hình")}>⤢</button>
        </div>
        {sel && (
          <div className="rm-drawer">
            <span className="rm-drawer-id">{sel.id.split(":")[1]} · {sel.kind} · {sel.status}</span>
            <div className="rm-drawer-title">{pick(sel.label, locale)}</div>
            <div className="rm-drawer-body">{pick(sel.summary, locale)}</div>
            <div className="obs-audit rm-drawer-tech">{pick(sel.technical_summary, locale)} · {sel.scope}</div>
            <Link href={`/${locale}/observatory${sel.route}`} className="rm-open">{t(locale, "Open →", "Mở →")}</Link>
          </div>
        )}
      </div>
      <div className="rm-hint">{t(locale, "Drag to pan · scroll to zoom · tap a node to inspect · Focus mode isolates ancestors and descendants.", "Kéo để di chuyển · cuộn để zoom · chạm node để xem · Chế độ tập trung cô lập tổ tiên và hậu duệ.")}</div>
    </div>
  );
}
