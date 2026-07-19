/**
 * HIVE-LRC Observatory projector (Phase 1).
 * Reads the reviewed public ontology + the gate timeline and emits immutable, hash-addressed JSON
 * snapshots under public/observatory/. NO private store is read. Run: `node scripts/build-observatory.mts`.
 * The governance scanner (observatory-governance.mjs) must pass on the output before it is served.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { gates } from "../src/data/wiki/gates.ts";
import { claims, edges, releases, artifacts } from "../src/data/observatory/ontology.ts";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "public", "observatory");
mkdirSync(OUT, { recursive: true });

// gate nodes + the D0->D16 arc
const gateNodes = gates.map((g) => ({
  id: `gate:${g.id}`, kind: "gate", label: g.title, short_label: { en: g.phase, vi: g.phase },
  status: g.status, evidence: g.independence, scope: g.phase, gate: g.id,
  summary: g.summary, technical_summary: g.summary, route: `/gates/${g.id}`,
  valid_from_release: null, valid_to_release: null,
}));
const arcEdges = gates.slice(1).map((g, i) => ({
  id: `arc:${gates[i].id}->${g.id}`, source: `gate:${gates[i].id}`, target: `gate:${g.id}`,
  relation: "depends_on", explanation: { en: "Research arc order.", vi: "Thứ tự tiến trình nghiên cứu." },
  valid_from_release: null, valid_to_release: null,
}));

// claim nodes + claim->gate "introduced" edges
const claimNodes = claims.map((c) => ({
  id: `claim:${c.claim_id}`, kind: "claim", label: c.statement, short_label: { en: c.claim_id, vi: c.claim_id },
  status: c.status, evidence: c.evidence, scope: c.scope, gate: c.gate_last_changed,
  summary: c.plain_language, technical_summary: c.statement, route: `/claims/${c.claim_id}`,
  valid_from_release: null, valid_to_release: c.superseded_by ? "superseded" : null,
}));
const introducedEdges = claims.map((c) => ({
  id: `intro:${c.claim_id}`, source: `gate:${c.gate_introduced}`, target: `claim:${c.claim_id}`,
  relation: "supports", explanation: { en: `Introduced at ${c.gate_introduced}.`, vi: `Xuất hiện tại ${c.gate_introduced}.` },
  valid_from_release: null, valid_to_release: null,
}));
const claimEdges = edges.map((e, i) => ({
  id: `dep:${i}:${e.source}->${e.target}`, source: `claim:${e.source}`, target: `claim:${e.target}`,
  relation: e.relation, explanation: e.explanation,
  valid_from_release: e.valid_from_release, valid_to_release: e.valid_to_release ?? null,
}));
const artifactNodes = artifacts.map((a) => ({
  id: `artifact:${a.artifact_id}`, kind: "artifact", label: { en: a.title, vi: a.title },
  short_label: { en: a.artifact_id, vi: a.artifact_id }, status: a.verification_status, evidence: "I2",
  scope: a.corruption, gate: a.source_gate, summary: { en: a.title, vi: a.title },
  technical_summary: { en: `${a.type} · ${a.verification_status} · ${a.corruption}`, vi: `${a.type} · ${a.verification_status} · ${a.corruption}` },
  route: `/verification/${a.artifact_id}`, valid_from_release: null, valid_to_release: null,
}));

const nodes = [...gateNodes, ...claimNodes, ...artifactNodes];
const graphEdges = [...arcEdges, ...introducedEdges, ...claimEdges];

// full gate records (public milestone history: bilingual title/summary/checks, status, evidence)
const publicGates = gates.map((g) => ({
  id: g.id, phase: g.phase, title: g.title, status: g.status, verify: g.verify,
  independence: g.independence, date: g.date, summary: g.summary, checks: g.checks,
  artifacts: g.artifacts, route: `/gates/${g.id}`,
}));

const datasets: Record<string, unknown> = {
  "public_releases": releases,
  "public_claims": claims,
  "public_gates": publicGates,
  "public_graph_nodes": nodes,
  "public_graph_edges": graphEdges,
  "public_artifacts": artifacts,
};

const meta = { generated_from: ["src/data/wiki/gates.ts", "src/data/observatory/ontology.ts"], lrc13: "OPEN", evidence_ceiling: "I2" };
let manifest: Record<string, string> = {};
for (const [name, data] of Object.entries(datasets)) {
  const json = JSON.stringify(data, null, 1);
  const hash = createHash("sha256").update(json).digest("hex");
  writeFileSync(join(OUT, `${name}.json`), json);
  manifest[name] = hash;
}
const indexPayload = { meta, counts: Object.fromEntries(Object.entries(datasets).map(([k, v]) => [k, (v as unknown[]).length])), manifest };
const indexJson = JSON.stringify(indexPayload, null, 1);
const snapshotHash = createHash("sha256").update(indexJson).digest("hex");
writeFileSync(join(OUT, "index.json"), JSON.stringify({ ...indexPayload, snapshot_hash: snapshotHash }, null, 1));

console.log("Observatory snapshot written to public/observatory/");
for (const [k, v] of Object.entries(datasets)) console.log(`  ${k}: ${(v as unknown[]).length} · ${manifest[k].slice(0, 12)}`);
console.log("  snapshot_hash:", snapshotHash.slice(0, 16));
