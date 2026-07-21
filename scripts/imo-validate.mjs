// HIVE-IMO X ledger validator (Contractor-required, TIP review).
// Dependency-free: reads the JSON Schema and enforces the structural rules the
// site relies on. Exits non-zero so `prebuild` fails on a bad ledger.
//
//   npm run imo:validate

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data", "imo2026");
const schema = JSON.parse(readFileSync(join(dataDir, "problem_record.schema.json"), "utf8"));

const STATUS_ENUM = schema.properties.status.enum;
const EVIDENCE_ENUM = schema.properties.evidence_class.enum;
const DEP_ENUM = schema.properties.official_solution_dependence.enum;
const REQUIRED = schema.required;
const STAGE_IDS = Array.from({ length: 15 }, (_, i) => `S${i}`);
const COMPLETE = ["VERIFIED-INDEPENDENT", "FORMALIZED", "PUBLISHED"];

const errors = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);

const seenIds = new Set();

for (let n = 1; n <= 6; n++) {
  const file = join(dataDir, `IMO2026-P${n}.json`);
  let r;
  try {
    r = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail(`P${n}`, `unreadable/invalid JSON (${e.message})`);
    continue;
  }
  const id = r.problem_id ?? `P${n}`;

  // required fields present
  for (const k of REQUIRED) if (!(k in r)) fail(id, `missing required field "${k}"`);

  // problem_id shape + uniqueness + matches filename number
  if (!/^IMO2026-P[1-6]$/.test(r.problem_id ?? "")) fail(id, `problem_id "${r.problem_id}" fails pattern`);
  if (seenIds.has(r.problem_id)) fail(id, `duplicate problem_id`);
  seenIds.add(r.problem_id);
  if (r.problem_id !== `IMO2026-P${n}`) fail(id, `problem_id does not match file P${n}`);

  // year / number / day coherence (P1-3 -> day 1, P4-6 -> day 2)
  if (r.year !== 2026) fail(id, `year must be 2026`);
  if (r.number !== n) fail(id, `number ${r.number} != ${n}`);
  const expectedDay = n <= 3 ? 1 : 2;
  if (r.day !== expectedDay) fail(id, `day ${r.day} != expected ${expectedDay}`);

  // enums
  if (!STATUS_ENUM.includes(r.status)) fail(id, `invalid status "${r.status}"`);
  if (!EVIDENCE_ENUM.includes(r.evidence_class)) fail(id, `invalid evidence_class "${r.evidence_class}"`);
  if (!DEP_ENUM.includes(r.official_solution_dependence)) fail(id, `invalid official_solution_dependence`);

  // exactly the 15 stages S0..S14, in order, each with a valid status
  if (!Array.isArray(r.stages) || r.stages.length !== 15) {
    fail(id, `stages must have exactly 15 entries (found ${r.stages?.length})`);
  } else {
    r.stages.forEach((s, i) => {
      if (s.id !== STAGE_IDS[i]) fail(id, `stage[${i}].id "${s.id}" != "${STAGE_IDS[i]}"`);
      if (!STATUS_ENUM.includes(s.status)) fail(id, `stage ${s.id} invalid status "${s.status}"`);
    });
  }

  // completeness invariant: a problem may only count as complete when its status
  // is VERIFIED-INDEPENDENT or beyond. Guard against any future "complete"/
  // "published" flag drifting ahead of the status enum.
  const flaggedComplete = r.complete === true || r.published === true;
  if (flaggedComplete && !COMPLETE.includes(r.status)) {
    fail(id, `flagged complete/published but status "${r.status}" < VERIFIED-INDEPENDENT`);
  }
  // a PUBLISHED status with no artifact manifest is suspicious
  if (r.status === "PUBLISHED" && !r.artifact_manifest_sha256) {
    fail(id, `status PUBLISHED but artifact_manifest_sha256 is null`);
  }
}

// once a problem is frozen, its official dossier + contamination ledger must exist
const NOT_FROZEN = ["NOT-STARTED"];
const CONTAM_FIELDS = ["official_solution_viewed", "unofficial_solution_viewed",
  "discussion_or_hint_viewed", "social_media_solution_viewed", "prior_memory_claimed"];
for (let n = 1; n <= 6; n++) {
  const rec = JSON.parse(readFileSync(join(dataDir, `IMO2026-P${n}.json`), "utf8"));
  if (NOT_FROZEN.includes(rec.status)) continue;
  const id = rec.problem_id;
  if (!rec.statement_en) fail(id, "frozen but statement_en missing");
  const clPath = join(root, "public", "imo2026", `p${n}`, "official", "contamination_ledger.json");
  if (!existsSync(clPath)) { fail(id, "frozen but contamination_ledger.json missing"); continue; }
  try {
    const cl = JSON.parse(readFileSync(clPath, "utf8"));
    for (const actor of ["human", "sol", "fable"]) {
      if (!cl.actors?.[actor]) { fail(id, `contamination ledger missing actor ${actor}`); continue; }
      for (const f of CONTAM_FIELDS) {
        if (!(f in cl.actors[actor])) fail(id, `contamination ${actor}.${f} missing`);
      }
    }
  } catch (e) { fail(id, `contamination ledger invalid JSON (${e.message})`); }
}

// S0-R legacy audit records: validate against schema + enforce Builder scope
// (no obligation may sit in a post-CLAIMED / verified state; audit stays 0/6).
const auditSchema = JSON.parse(readFileSync(join(dataDir, "legacy_audit_record.schema.json"), "utf8"));
const AR_REQ = auditSchema.required;
const OBLIG_ENUM = auditSchema.properties.proof_obligations.items.properties.status.enum;
const BUILDER_ALLOWED = new Set(["UNPARSED", "CLAIMED"]);
const AUDIT_STATUS_ENUM = auditSchema.properties.audit_status.enum;
let auditedCount = 0;
for (let n = 1; n <= 6; n++) {
  const arPath = join(root, "public", "imo2026", `p${n}`, "audit", "legacy_audit_record.json");
  if (!existsSync(arPath)) continue; // reconciliation not run yet is allowed
  const id = `IMO2026-P${n}`;
  let ar;
  try { ar = JSON.parse(readFileSync(arPath, "utf8")); }
  catch (e) { fail(id, `legacy_audit_record.json invalid (${e.message})`); continue; }
  for (const k of AR_REQ) if (!(k in ar)) fail(id, `audit record missing "${k}"`);
  if (!/^[a-f0-9]{64}$/.test(ar.manuscript?.sha256 ?? "")) fail(id, "audit record: bad manuscript sha256");
  if (!AUDIT_STATUS_ENUM.includes(ar.audit_status)) fail(id, `audit record: bad audit_status ${ar.audit_status}`);
  if (["VERIFIED-INDEPENDENT", "FORMALIZED"].includes(ar.audit_status)) auditedCount++;
  for (const o of ar.proof_obligations ?? []) {
    if (!OBLIG_ENUM.includes(o.status)) fail(id, `obligation ${o.id}: status ${o.status} not in schema enum`);
    if (!BUILDER_ALLOWED.has(o.status)) fail(id, `obligation ${o.id}: status ${o.status} exceeds Builder scope (only UNPARSED/CLAIMED allowed in S0-R)`);
  }
}
if (auditedCount !== 0) fail("AUDIT-COUNT", `audit dashboard must remain 0/6 during reconciliation, found ${auditedCount}`);

if (errors.length) {
  console.error(`\n✗ imo:validate - ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

console.log(`✓ imo:validate - 6/6 ledger records valid (schema + structural rules).`);
