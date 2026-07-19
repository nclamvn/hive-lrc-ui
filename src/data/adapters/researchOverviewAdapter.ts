import type { Locale, Messages } from "@/i18n";
import {
  overviewDemoFixture,
  type ClaimStatus,
  type NoveltyStatus,
  type ReproductionState,
  type RiskPriority,
  type EdgeKind,
} from "@/data/fixtures/overview.demo";

/**
 * Adapter layer: components never read fixtures/logs/markdown directly.
 * View models carry display strings resolved from i18n + fixture data.
 */

export interface HeaderMetaVM {
  date: string;
  timezone: string;
  version: string;
  build: string;
}

export interface ClaimRowVM {
  id: string;
  label: string;
  status: ClaimStatus;
  statusLabel: string;
  noveltyLabel: string; // "NU" or em dash
}

export interface ReproductionStageVM {
  k: number;
  state: ReproductionState;
  stateLabel: string;
}

export interface RiskRowVM {
  id: string;
  label: string;
  priority: RiskPriority;
  resolved: boolean;
  resolvedLabel: string;
}

export interface ResourceBucketVM {
  id: string;
  label: string;
  bars: readonly number[];
  tone: string;
}

export interface GraphNodeVM {
  id: string;
  lines: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  emphasis: boolean;
}

export interface GraphEdgeVM {
  from: string;
  to: string;
  kind: EdgeKind;
}

const STATUS_KEY: Record<ClaimStatus, keyof Messages["statuses"]> = {
  open: "open",
  external_claim: "externalClaim",
  verified_local: "verifiedLocal",
  supported_internal: "supportedInternal",
  refuted_as_is: "refutedAsIs",
  next: "next",
  blocked: "pending",
};

const STAGE_KEY: Record<ReproductionState, keyof Messages["statuses"]> = {
  completed: "completed",
  next: "next",
  pending: "pending",
  target: "target",
};

function noveltyLabel(n: NoveltyStatus): string {
  return n === "nu" ? "NU" : "-";
}

export function buildOverviewViewModel(messages: Messages, locale: Locale, demoMode: boolean) {
  const f = overviewDemoFixture;

  const headerMeta: HeaderMetaVM = demoMode
    ? {
        date: f.header.date[locale],
        timezone: f.header.timezone,
        version: f.header.version,
        build: f.header.build,
      }
    : {
        date: new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
          dateStyle: "medium",
          timeZone: "UTC",
        }).format(new Date()),
        timezone: "UTC",
        version: f.header.version,
        build: f.header.build,
      };

  const claims: ClaimRowVM[] = f.claims.map((c) => ({
    id: c.id,
    label: messages.claims[c.labelKey as keyof Messages["claims"]],
    status: c.status,
    statusLabel: messages.statuses[STATUS_KEY[c.status]],
    noveltyLabel: noveltyLabel(c.novelty),
  }));

  const reproduction: ReproductionStageVM[] = f.reproduction.map((s) => ({
    k: s.k,
    state: s.state,
    stateLabel: messages.statuses[STAGE_KEY[s.state]],
  }));

  const workflow = f.workflow.steps.map((key) => ({
    key,
    label: messages.workflow[key as keyof Messages["workflow"]],
    current: key === f.workflow.currentKey,
  }));

  const risks: RiskRowVM[] = f.risks.map((r) => ({
    id: r.id,
    label: messages.risks[r.labelKey as keyof Messages["risks"]],
    priority: r.priority,
    resolved: r.resolved === true,
    resolvedLabel: messages.statuses.resolved,
  }));

  const resources: ResourceBucketVM[] = f.resources.buckets.map((b) => ({
    id: b.id,
    label: messages.resources[b.labelKey as keyof Messages["resources"]],
    bars: b.bars,
    tone: b.tone,
  }));

  const graphNodes: GraphNodeVM[] = f.graph.nodes.map((n) => {
    const lines: string[] = [];
    if (n.labelKey) lines.push(messages.graph[n.labelKey as keyof Messages["graph"]]);
    if (n.detail) lines.push(n.detail);
    return { id: n.id, lines, x: n.x, y: n.y, w: n.w, h: n.h, emphasis: n.emphasis === "strong" };
  });

  const graphEdges: GraphEdgeVM[] = [...f.graph.edges];

  const notes = f.notes.map((k) => messages.notes[k as keyof Messages["notes"]]);

  return {
    headerMeta,
    metrics: f.metrics,
    claims,
    reproduction,
    bottleneck: f.bottleneck,
    workflow,
    risks,
    resources,
    graphNodes,
    graphEdges,
    notes,
  };
}

export type OverviewViewModel = ReturnType<typeof buildOverviewViewModel>;
