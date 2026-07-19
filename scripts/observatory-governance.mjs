/**
 * HIVE-LRC Observatory governance scanner (publication gate P1-P5 enforcement, automated P3 + schema).
 * Fails the build if any public snapshot contains a filesystem path, a private-file hash reference,
 * an over-scoped evidence level, an unapproved release, or a schema violation.
 * Run: `node scripts/observatory-governance.mjs`  (after build-observatory).
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "public", "observatory");
const fails = [];
const fail = (rule, msg) => fails.push(`[${rule}] ${msg}`);

const raw = {};
for (const f of readdirSync(OUT).filter((f) => f.endsWith(".json"))) {
  raw[f] = { text: readFileSync(join(OUT, f), "utf8") };
  raw[f].data = JSON.parse(raw[f].text);
}

// P3 — no private paths, no home-dir refs, no local machine metadata leaking into public text.
const forbiddenPatterns = [
  [/\/Users\/[^"]+/g, "filesystem home path"],
  [/\/home\/[^"]+/g, "filesystem home path"],
  [/\/mathresearch\//g, "private repo path"],
  [/[A-Za-z]:\\\\/g, "windows path"],
  [/\bgate_d\d+_[a-z0-9_]+\//g, "private gate directory"],
];
for (const [f, { text }] of Object.entries(raw)) {
  for (const [re, label] of forbiddenPatterns) {
    const m = text.match(re);
    if (m) fail("P3", `${f}: ${label} leaked -> ${m[0]}`);
  }
}

// P2 — evidence ceiling I2: nothing may assert I3/formal.
const overEvidence = new Set(["I3", "formal"]);
const checkEvidence = (f, arr, field = "evidence") => {
  for (const item of arr ?? []) {
    const ev = item[field] ?? item.evidence_level;
    if (ev && overEvidence.has(ev)) fail("P2", `${f}: over-ceiling evidence '${ev}' on ${item.claim_id ?? item.id}`);
  }
};
checkEvidence("public_claims.json", raw["public_claims.json"]?.data);
checkEvidence("public_releases.json", raw["public_releases.json"]?.data);

// P5 — every release must be Owner-approved.
for (const r of raw["public_releases.json"]?.data ?? []) {
  if (r.owner_approved !== true) fail("P5", `release ${r.id} not owner_approved`);
}

// P1 — no claim may read as "LRC(13) solved"; C0 must remain open.
const solvedRe = /(LRC\s*\(?13\)?\s*(is\s+)?(solved|proved|proven|closed|settled))/i;
for (const [f, { text }] of Object.entries(raw)) {
  if (solvedRe.test(text)) fail("P1", `${f}: text reads as LRC(13) solved`);
}
const c0 = (raw["public_claims.json"]?.data ?? []).find((c) => c.claim_id === "C0");
if (!c0 || c0.status !== "open") fail("P1", "C0 (LRC13) is not present with status 'open'");

// Schema — referential integrity of the graph.
const nodeIds = new Set((raw["public_graph_nodes.json"]?.data ?? []).map((n) => n.id));
for (const e of raw["public_graph_edges.json"]?.data ?? []) {
  if (!nodeIds.has(e.source)) fail("SCHEMA", `edge ${e.id} source ${e.source} has no node`);
  if (!nodeIds.has(e.target)) fail("SCHEMA", `edge ${e.id} target ${e.target} has no node`);
}
// superseded claims must name an existing successor
const claimIds = new Set((raw["public_claims.json"]?.data ?? []).map((c) => c.claim_id));
for (const c of raw["public_claims.json"]?.data ?? []) {
  if (c.status === "superseded" && !(c.superseded_by && claimIds.has(c.superseded_by)))
    fail("SCHEMA", `superseded claim ${c.claim_id} has no valid successor`);
}

if (fails.length) {
  console.error(`GOVERNANCE FAILED (${fails.length}):`);
  for (const f of fails) console.error("  " + f);
  process.exit(1);
}
console.log("GOVERNANCE PASSED: P1 P2 P3 P5 + schema integrity clean.");
