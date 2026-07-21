// HIVE-IMO X - machine-readable ledger loader.
//
// Fable (Builder) contract: this module READS state from the approved JSON
// ledger. It never fabricates mathematical progress. Every problem is
// initialized from src/data/imo2026/IMO2026-P{n}.json and rendered verbatim.
// A problem is only counted toward "x/6 complete" once its status reaches an
// independently-verified tier - see COMPLETE_STATUSES below.

import P1 from "@/data/imo2026/IMO2026-P1.json";
import P2 from "@/data/imo2026/IMO2026-P2.json";
import P3 from "@/data/imo2026/IMO2026-P3.json";
import P4 from "@/data/imo2026/IMO2026-P4.json";
import P5 from "@/data/imo2026/IMO2026-P5.json";
import P6 from "@/data/imo2026/IMO2026-P6.json";

export const STATUSES = [
  "NOT-STARTED",
  "FROZEN-PENDING-REVIEW",
  "OFFICIAL-FROZEN",
  "HUMAN-READ",
  "AI-READ",
  "DECOMPOSED",
  "CANDIDATE-LEMMA",
  "CANDIDATE-PROOF",
  "COUNTEREXAMPLE-FOUND",
  "REPAIR-IN-PROGRESS",
  "VERIFIED-INTERNAL",
  "VERIFIED-INDEPENDENT",
  "FORMALIZED",
  "PUBLISHED",
] as const;
export type Status = (typeof STATUSES)[number];

/** Only these three tiers count toward the "x/6 complete" index (brief §2). */
export const COMPLETE_STATUSES: readonly Status[] = [
  "VERIFIED-INDEPENDENT",
  "FORMALIZED",
  "PUBLISHED",
];

export type EvidenceClass = "I0" | "I1" | "I2" | "I3" | "I4";

export type OfficialDependence = "NONE" | "POST-HOC-COMPARISON" | "PARTIAL" | "YES";

export type ContributionLevel = "LEAD" | "CO-LEAD" | "SUPPORT" | "VERIFY" | "NONE";

export const STAGE_IDS = [
  "S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7",
  "S8", "S9", "S10", "S11", "S12", "S13", "S14",
] as const;
export type StageId = (typeof STAGE_IDS)[number];

export interface StageEntry {
  id: StageId;
  status: Status;
  human: string;
  ai: string;
  artifacts: Artifact[];
}

export interface Artifact {
  name: string;
  href?: string;
  sha256?: string;
  bytes?: number;
}

export interface ProblemRecord {
  problem_id: string;
  year: 2026;
  day: 1 | 2;
  number: number;
  domain: string[];
  status: Status;
  official_source: string;
  official_solution_dependence: OfficialDependence;
  official_solution_viewed?: boolean;
  evidence_class: EvidenceClass;
  stages: StageEntry[];
  contributions: Partial<Record<string, Partial<Record<"human" | "sol" | "fable" | "independent", ContributionLevel>>>>;
  proofs_rejected: number;
  counterexamples_found: number;
  lemmas_retained?: number;
  human_minutes?: number;
  ai_compute_minutes?: number;
  last_updated: string;
  artifact_manifest_sha256: string | null;
  // Present from S0 (OFFICIAL-FROZEN) onward: verbatim statement + provenance.
  statement_en?: string;
  statement_vi?: string;
  source?: {
    url: string;
    edition_url?: string;
    fetched_at: string;
    raw_page_sha256: string;
    dossier_dir: string;
  };
  s0_review?: {
    state: string;
    v2_english_semantic: string;
    v3_vietnamese: string;
    human_contamination_attestation: string;
    passes_official_freeze: boolean;
  };
  // Two-tier history: a legacy manuscript may exist independently of the new
  // pipeline's source-freeze status and proof audit.
  legacy_manuscript?: {
    available: boolean;
    file: string;
    sha256: string;
    created: string;
    level: string;
    audit_state: string;
    label: string;
  };
  proof_audit?: Status | "NOT-STARTED";
  internal_prior_solution_exposure?: boolean;
  reconciliation?: {
    state: string;
    obligations: number;
    load_bearing: number;
    statement_match: string;
    audit_dir: string;
    record_sha256: string;
    reconciled_at: string;
  };
}

const RECORDS = [P1, P2, P3, P4, P5, P6] as unknown as ProblemRecord[];

export function allProblems(): ProblemRecord[] {
  return [...RECORDS].sort((a, b) => a.number - b.number);
}

export function problemsByDay(day: 1 | 2): ProblemRecord[] {
  return allProblems().filter((p) => p.day === day);
}

/** e.g. "problem-3" -> record for P3, or null. */
export function problemBySlug(slug: string): ProblemRecord | null {
  const m = /^problem-([1-6])$/.exec(slug);
  if (!m) return null;
  return allProblems().find((p) => p.number === Number(m[1])) ?? null;
}

export function slugFor(p: ProblemRecord): string {
  return `problem-${p.number}`;
}

export function isComplete(p: ProblemRecord): boolean {
  return COMPLETE_STATUSES.includes(p.status);
}

/** Number of problems at an independently-verified tier (the honest x of x/6). */
export function completedCount(): number {
  return allProblems().filter(isComplete).length;
}

/** True only when ALL six problems reach at least VERIFIED-INDEPENDENT (brief §11). */
export function summaryUnlocked(): boolean {
  return completedCount() === 6;
}

export interface LedgerTotals {
  completed: number;
  total: number;
  proofsRejected: number;
  counterexamples: number;
  lemmasRetained: number;
  humanMinutes: number;
  aiComputeMinutes: number;
  lastUpdated: string | null;
}

export function ledgerTotals(): LedgerTotals {
  const ps = allProblems();
  const sum = (f: (p: ProblemRecord) => number) => ps.reduce((n, p) => n + f(p), 0);
  const dates = ps.map((p) => p.last_updated).filter(Boolean).sort();
  return {
    completed: completedCount(),
    total: ps.length,
    proofsRejected: sum((p) => p.proofs_rejected ?? 0),
    counterexamples: sum((p) => p.counterexamples_found ?? 0),
    lemmasRetained: sum((p) => p.lemmas_retained ?? 0),
    humanMinutes: sum((p) => p.human_minutes ?? 0),
    aiComputeMinutes: sum((p) => p.ai_compute_minutes ?? 0),
    lastUpdated: dates.length ? dates[dates.length - 1] : null,
  };
}

/** Ordinal index of a status within the pipeline for progress rendering. */
export function statusIndex(s: Status): number {
  return STATUSES.indexOf(s);
}

// ── two-tier history counters (a legacy manuscript existing ≠ verified) ───────

/** Problems that have a legacy solution manuscript on file. */
export function legacyManuscriptCount(): number {
  return allProblems().filter((p) => p.legacy_manuscript?.available).length;
}

/** Problems whose official statement freeze has passed Contractor review. */
export function officialReviewedCount(): number {
  return allProblems().filter((p) => p.s0_review?.passes_official_freeze).length;
}

/** Problems whose PROOF (not just source) reached an independently-verified tier. */
export function independentlyAuditedCount(): number {
  return allProblems().filter((p) =>
    COMPLETE_STATUSES.includes((p.proof_audit ?? "NOT-STARTED") as Status),
  ).length;
}
