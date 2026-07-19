/**
 * Demo fixture — the single approved data source for the golden view.
 * Every value here was locked by the Contractor in TIP-UI-001 §12.
 * No component may invent research states beyond this file.
 */

export type ClaimStatus =
  | "open"
  | "external_claim"
  | "verified_local"
  | "supported_internal"
  | "refuted_as_is"
  | "next"
  | "blocked";

export type NoveltyStatus = "nu" | "not_applicable" | "unknown";

export type RiskPriority = "P0" | "P1" | "P2";

export type ReproductionState = "completed" | "next" | "pending" | "target";

export type EdgeKind = "proven" | "in_progress" | "open";

export interface ClaimFixture {
  id: string;
  labelKey: string; // i18n key under claims.*
  status: ClaimStatus;
  novelty: NoveltyStatus;
}

export interface RiskFixture {
  id: string;
  labelKey: string; // i18n key under risks.*
  priority: RiskPriority;
  resolved?: boolean;
}

export interface ReproductionStage {
  k: number;
  state: ReproductionState;
}

export interface GraphNodeFixture {
  id: string;
  labelKey?: string; // i18n key under graph.*; omitted for untranslatable literals
  /** extra literal line that must not be translated (math/k values) */
  detail?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  emphasis?: "strong";
}

export interface GraphEdgeFixture {
  from: string;
  to: string;
  kind: EdgeKind;
}

export const overviewDemoFixture = {
  header: {
    date: { en: "May 18, 2025", vi: "18 thg 5, 2025" },
    timezone: "UTC",
    version: "v0.9.7",
    build: "Build 1423",
  },
  /**
   * Phase/claims/risks/workflow derived from the Contractor state file
   * src/data/state/hive-state.json (HIVE_LRC_STATE_GATE_A_PASS, 2026-07-17).
   */
  metrics: {
    targetClaimLatex: "\\operatorname{LRC}(13)",
    currentPhase: "Gate D17",
  },
  claims: [
    { id: "C0", labelKey: "c0", status: "open", novelty: "nu" },
    { id: "C1", labelKey: "c1", status: "external_claim", novelty: "not_applicable" },
    { id: "C2", labelKey: "c2", status: "verified_local", novelty: "not_applicable" },
    { id: "C-D4-K13-P191", labelKey: "cd4", status: "supported_internal", novelty: "not_applicable" },
    { id: "C-D5-UNIFORM", labelKey: "cd5", status: "supported_internal", novelty: "not_applicable" },
  ] satisfies ClaimFixture[],
  reproduction: [
    { k: 9, state: "completed" },
    { k: 10, state: "next" },
    { k: 11, state: "pending" },
    { k: 12, state: "pending" },
    { k: 13, state: "target" },
  ] satisfies ReproductionStage[],
  bottleneck: {
    /** Illustrative only — labelled as such in UI per TIP §12.4. */
    points: [
      { k: 9, value: 8.3e1, label: "8.3 \\times 10^{1}" },
      { k: 10, value: 1.7e3, label: "1.7 \\times 10^{3}" },
      { k: 11, value: 4.9e4, label: "4.9 \\times 10^{4}" },
      { k: 12, value: 2.6e6, label: "2.6 \\times 10^{6}" },
      { k: 13, value: 4.8e11, label: "4.8 \\times 10^{11}" },
    ],
    yTicks: [0, 3, 6, 9, 12], // exponents of 10
  },
  workflow: {
    steps: [
      "scan",
      "contractorReview",
      "gateA",
      "gateB",
      "gateC",
      "gateD",
      "certify",
      "attack",
    ],
    currentKey: "gateD",
  },
  risks: [
    { id: "R1-B", labelKey: "r1b", priority: "P0" },
    { id: "R2", labelKey: "r2", priority: "P0", resolved: true },
    { id: "R3", labelKey: "r3", priority: "P0" },
  ] satisfies RiskFixture[],
  resources: {
    /** Deterministic bar heights (0..1) — never random. Shapes mirror the golden mock. */
    buckets: [
      {
        id: "S",
        labelKey: "plentiful",
        bars: [0.22, 0.38, 0.52, 0.68, 0.85, 1.0, 0.8, 0.62, 0.46, 0.32, 0.2],
        tone: "light",
      },
      {
        id: "M",
        labelKey: "moderate",
        bars: [0.28, 0.5, 0.72, 0.58, 0.92, 1.0, 0.68, 0.84, 0.52, 0.36, 0.24],
        tone: "mid",
      },
      {
        id: "L",
        labelKey: "constrained",
        bars: [1.0, 0.72, 0.3, 0.24, 0.42, 0.2, 0.36, 0.16, 0.3, 0.12, 0.2],
        tone: "dark",
      },
    ],
  },
  graph: {
    nodes: [
      { id: "lrc13", detail: "LRC(13)", x: 10, y: 46, w: 80, h: 30, emphasis: "strong" },
      { id: "upstream", labelKey: "upstream", detail: "(k ≤ 12)", x: 130, y: 18, w: 128, h: 34 },
      { id: "bounds", labelKey: "bounds", x: 130, y: 76, w: 128, h: 26 },
      { id: "certificate", labelKey: "certificate", x: 306, y: 4, w: 122, h: 26 },
      { id: "traceability", labelKey: "traceability", x: 306, y: 46, w: 122, h: 26 },
      { id: "integrity", labelKey: "integrity", x: 306, y: 84, w: 134, h: 34 },
      { id: "checker", labelKey: "checker", x: 500, y: 24, w: 128, h: 26 },
      { id: "ladder", labelKey: "ladder", detail: "(k = 9 … 13)", x: 500, y: 74, w: 128, h: 34 },
      { id: "attack", labelKey: "attack", x: 678, y: 42, w: 94, h: 38, emphasis: "strong" },
    ] satisfies GraphNodeFixture[],
    edges: [
      { from: "lrc13", to: "upstream", kind: "proven" },
      { from: "lrc13", to: "bounds", kind: "proven" },
      { from: "upstream", to: "certificate", kind: "in_progress" },
      { from: "upstream", to: "traceability", kind: "proven" },
      { from: "bounds", to: "integrity", kind: "proven" },
      { from: "certificate", to: "checker", kind: "in_progress" },
      { from: "traceability", to: "checker", kind: "proven" },
      { from: "integrity", to: "ladder", kind: "in_progress" },
      { from: "checker", to: "attack", kind: "in_progress" },
      { from: "ladder", to: "attack", kind: "open" },
    ] satisfies GraphEdgeFixture[],
  },
  notes: ["a1", "a2", "a3", "a4"],
} as const;

export type OverviewDemoFixture = typeof overviewDemoFixture;
