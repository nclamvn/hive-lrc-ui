/**
 * Observatory data loader – reads ONLY the generated public snapshot (public/observatory/*.json).
 * The public site never imports the private research store; types come from the ontology module
 * (erased at runtime), data comes from the reviewed, governance-scanned JSON.
 */
import type {
  PublicClaim, PublicRelease, PublicArtifact, Bi, ClaimStatus, Evidence,
} from "@/data/observatory/ontology";
import releasesJson from "../../public/observatory/public_releases.json";
import claimsJson from "../../public/observatory/public_claims.json";
import gatesJson from "../../public/observatory/public_gates.json";
import nodesJson from "../../public/observatory/public_graph_nodes.json";
import edgesJson from "../../public/observatory/public_graph_edges.json";
import artifactsJson from "../../public/observatory/public_artifacts.json";
import indexJson from "../../public/observatory/index.json";

export type { Bi, ClaimStatus, Evidence };

export interface GraphNode {
  id: string; kind: string; label: Bi; short_label: Bi; status: string;
  evidence: string; scope: string; gate: string; summary: Bi; technical_summary: Bi;
  route: string; valid_from_release: string | null; valid_to_release: string | null;
}
export interface GraphEdge {
  id: string; source: string; target: string; relation: string; explanation: Bi;
  valid_from_release: string | null; valid_to_release: string | null;
}

export interface PublicGate {
  id: string; phase: string; title: Bi; status: string; verify: string;
  independence: string; date: string; summary: Bi; checks: Bi[]; artifacts: number; route: string;
}

export const releases = releasesJson as unknown as PublicRelease[];
export const claims = claimsJson as unknown as PublicClaim[];
export const gates = gatesJson as unknown as PublicGate[];
export const nodes = nodesJson as unknown as GraphNode[];
export const edges = edgesJson as unknown as GraphEdge[];
export const artifacts = artifactsJson as unknown as PublicArtifact[];
export const snapshot = indexJson as unknown as {
  meta: { lrc13: string; evidence_ceiling: string };
  counts: Record<string, number>;
  manifest: Record<string, string>;
  snapshot_hash: string;
};

export type Locale = "en" | "vi";
export const pick = (bi: Bi | undefined, locale: Locale): string =>
  bi ? bi[locale] ?? bi.en : "";

/** Releases newest-first. */
export const releasesDesc = (): PublicRelease[] =>
  [...releases].sort((a, b) => b.sequence - a.sequence);

export const gateById = (id: string) => gates.find((g) => g.id === id);
export const claimById = (id: string) => claims.find((c) => c.claim_id === id);
export const releaseById = (id: string) => releases.find((r) => r.id === id);
export const artifactById = (id: string) => artifacts.find((a) => a.artifact_id === id);

/** Human labels for statuses (monochrome; the UI encodes state by shape/weight, not color). */
export const claimStatusLabel: Record<ClaimStatus, Bi> = {
  proved_internal: { en: "Proved (internal)", vi: "Đã chứng minh (nội bộ)" },
  validated_exact: { en: "Validated (exact)", vi: "Đã thẩm định (chính xác)" },
  validated_bounded: { en: "Validated (bounded)", vi: "Đã thẩm định (có chặn)" },
  supported_internal: { en: "Supported (internal)", vi: "Có cơ sở (nội bộ)" },
  supported_conditional: { en: "Supported (conditional)", vi: "Có cơ sở (điều kiện)" },
  provisional: { en: "Provisional", vi: "Tạm thời" },
  refuted: { en: "Refuted", vi: "Bị bác" },
  superseded: { en: "Superseded", vi: "Đã thay thế" },
  open: { en: "Open", vi: "Mở" },
  external_claim: { en: "External claim", vi: "Claim ngoài" },
};

export const changeTypeLabel: Record<string, Bi> = {
  THEOREM_PROVED: { en: "Theorem proved", vi: "Định lý chứng minh" },
  CLAIM_UPDATED: { en: "Claim updated", vi: "Cập nhật claim" },
  CLAIM_WITHDRAWN: { en: "Claim withdrawn", vi: "Rút claim" },
  COUNTEREXAMPLE_FOUND: { en: "Counterexample", vi: "Phản ví dụ" },
  GATE_OPENED: { en: "Gate opened", vi: "Mở gate" },
  GATE_CLOSED: { en: "Gate closed", vi: "Đóng gate" },
  RISK_OPENED: { en: "Risk opened", vi: "Mở rủi ro" },
  RISK_CLOSED: { en: "Risk closed", vi: "Đóng rủi ro" },
  CERTIFICATE_VERIFIED: { en: "Certificate verified", vi: "Chứng nhận kiểm" },
  ARTIFACT_PUBLISHED: { en: "Artifact published", vi: "Công bố artifact" },
  ARCHITECTURE_CHANGED: { en: "Architecture changed", vi: "Đổi kiến trúc" },
};

/** Status → monochrome visual token class (see observatory.css). */
export const statusToken = (status: string): string => {
  switch (status) {
    case "proved_internal": case "pass": case "two_verifiers_accept": return "obs-tok-proved";
    case "validated_exact": case "validated_bounded": return "obs-tok-validated";
    case "supported_internal": case "supported_conditional": case "partial": case "current": return "obs-tok-supported";
    case "provisional": case "pending": return "obs-tok-provisional";
    case "refuted": case "blocked": return "obs-tok-refuted";
    case "superseded": return "obs-tok-superseded";
    case "open": return "obs-tok-open";
    default: return "obs-tok-open";
  }
};
