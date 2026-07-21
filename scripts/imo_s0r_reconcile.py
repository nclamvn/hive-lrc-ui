#!/usr/bin/env python3
"""TIP-HIMO-S0R-000 — reconcile six legacy manuscripts into verifier-ready dossiers.

Builder scope ONLY: hash, extract, map sections, build proof-obligation skeletons
(nodes CLAIMED / UNPARSED only), record provenance + exposure, emit clean verifier
input packages. NO correctness claims, NO repairs, NO official-solution comparison,
NO P1 audit. audit_status stays RECONCILED; the audit count stays 0/6.
"""
import fitz  # PyMuPDF
import hashlib, json, re, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public" / "imo2026"
DATA = ROOT / "src" / "data" / "imo2026"
UPDATED = "2026-07-21T12:00:00+07:00"
ORIG_DIR = "/Users/os/Downloads/IMO2026"
RAW_SHA = hashlib.sha256((PUB / "official_source" / "problems_2026.raw.html").read_bytes()).hexdigest()

LEGACY = {
    1: "IMO2026_Day1_Problem1.pdf", 2: "IMO2026_Day1_Problem2.pdf", 3: "IMO2026_Day1_Problem3.pdf",
    4: "IMO2026_Day2_Problem4.pdf", 5: "IMO2026_Day2_Problem5.pdf", 6: "IMO2026_Day2_Problem6.pdf",
}
# signature math tokens that must appear in the manuscript's restated problem
STMT_TOKENS = {
    1: ["2026", "gcd", "lcm"], 2: ["ABC", "OM", "ON"], 3: ["c_n", "2^{n+1}"] ,
    4: ["180", "\\theta"], 5: ["f(f(y))", "\\mathbb{R}_{>0}"], 6: ["a_{n+T}", "gcd"],
}
# Proof-obligation skeletons from the gate's load-bearing targets + manuscript structure.
# status is ALWAYS "CLAIMED" (the manuscript claims it; not verified) — Builder may not
# use any post-CLAIMED state. load_bearing marks the gate's flagged steps.
OBLIG = {
 1: [("O1","Each move yields positive integers; moves are well-defined",[],False),
     ("O2","Process terminates via lexicographic descent of (S,k)",["O1"],True),
     ("O3","Terminal state has exactly one integer M>1",["O2"],False),
     ("O4","Per-prime valuation-column gcd g_p is invariant",["O1"],True),
     ("O5","Final-state uniqueness: M = prod p^{gcd(v_p(x_i))}",["O3","O4"],True)],
 2: [("O1","Reflection K',L' give cyclic quads (A,C,K,K') and (A,B,L,L')",[],True),
     ("O2","Antipode reduction: OM=ON iff DB=DC",["O1"],False),
     ("O3","Coordinate parameterization of the configuration",["O1"],False),
     ("O4","Non-degeneracy Delta != 0",["O3"],True),
     ("O5","Load-bearing identity Delta*G = Q_K*E_K + Q_L*E_L",["O3"],True),
     ("O6","Conclude DB=DC hence OM=ON",["O2","O4","O5"],False)],
 3: [("O1","Fixed-partition game value V=(1+Delta)/2 with pairing strategy",[],True),
     ("O2","Candidate optimum c_n = 2^n/(2^{n+1}-1)",["O1"],False),
     ("O3","Upper bound: subset-sum proximity + pairing cut budget <= n",["O1"],True),
     ("O4","Lower bound: powers of two + tree two-colouring, |R|>=1",["O1"],True),
     ("O5","Pairing bound |R| <= Delta'",["O4"],True),
     ("O6","Bounds meet at c_n",["O3","O5"],False)],
 4: [("O1","Normalized cut-state formulas (b,x,q-b-x) and (c,a-x,b+x)",[],True),
     ("O2","Integer k in (b,a+b) forces an integer-multiple angle in both branches",["O1"],True),
     ("O3","Monovariant m -> m-1 forces m=1 when q integer (Mulan wins)",["O2"],False),
     ("O4","Noninteger invariant preserved by >=1 branch when q not integer",["O1"],True),
     ("O5","Classification theta = 180/n, n>=2",["O3","O4"],False)],
 5: [("O1","Substitution x=f(y) gives f(f(y)) = 2 f(y) - y",[],True),
     ("O2","g=f-x: g(f(y))=g(y); orbit f^n(y)=y+n g(y); hence g>=0",["O1"],True),
     ("O3","Quantitative squeeze bounding g(x)-g(y)",[],True),
     ("O4","Positive values of g equal a single constant c (positive-step equality)",["O2","O3"],True),
     ("O5","Exclusion of mixed values {0,c}",["O3","O4"],True),
     ("O6","f(x)=x+c, c>=0",["O4","O5"],False)],
 6: [("O1","Greedy sequence = increasing enumeration of admissible set A",[],True),
     ("O2","A is upward-closed under divisibility and pairwise non-coprime",["O1"],True),
     ("O3","Minimal kernels; A = union of b*N over kernels",["O2"],False),
     ("O4","Witness-before-power lemma: a_j < d^s",["O1"],True),
     ("O5","Prime bound p < a_1^2 -> finitely many kernels",["O3","O4"],True),
     ("O6","Translation periodicity a_{n+T} = a_n + L",["O5"],False)],
}

def sha_bytes(b): return hashlib.sha256(b).hexdigest()
def sha_text(s): return hashlib.sha256(s.encode()).hexdigest()

def extract_text(pdf_path):
    doc = fitz.open(pdf_path)
    parts = [page.get_text("text") for page in doc]
    doc.close()
    return "\n".join(parts)

def section_map(text):
    # detect headers like "1 Đề bài", "2 Bản đồ chiến lược", "5 Phần (b): ..."
    secs = []
    for m in re.finditer(r"(?m)^\s*(\d{1,2})\s+([^\n]{3,80})$", text):
        title = m.group(2).strip()
        if len(title) > 2 and not title[0].isdigit():
            secs.append({"n": int(m.group(1)), "title": title, "char_offset": m.start()})
    # keep monotonic-ish unique by number
    seen, out = set(), []
    for s in secs:
        if s["n"] not in seen:
            seen.add(s["n"]); out.append(s)
    return out

def exposure(pid):
    return {
        "problem_id": pid,
        "human": {"official_solution_exposure": "UNKNOWN", "unofficial_external_solution_exposure": "UNKNOWN",
                  "internal_project_solution_exposure": "UNKNOWN", "search_history_exposure": "UNKNOWN",
                  "blind_reconstruction_eligible": "UNKNOWN",
                  "notes": "Owner attestation pending. Legacy manuscripts exist, so eligibility not established. Unknown is not false."},
        "sol": {"official_solution_exposure": False, "unofficial_external_solution_exposure": False,
                "internal_project_solution_exposure": True, "search_history_exposure": "UNKNOWN",
                "blind_reconstruction_eligible": False,
                "notes": "Sol read all six manuscripts during the deep dive; internal-project exposure TRUE; not eligible as blind reconstruction actor."},
        "fable": {"official_solution_exposure": False, "unofficial_external_solution_exposure": False,
                  "internal_project_solution_exposure": True, "search_history_exposure": False,
                  "blind_reconstruction_eligible": False,
                  "notes": "Fable extracted full text of all six manuscripts during S0-R; internal-project exposure TRUE. Only official statements were fetched from the organiser. Not eligible as blind reconstruction actor."},
        "updated_at": UPDATED,
    }

def dump(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n")
    return sha_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n")

records = []
for n in range(1, 7):
    pid = f"IMO2026-P{n}"
    fn = LEGACY[n]
    pdf = PUB / f"p{n}" / "legacy" / fn
    legacy_dir = PUB / f"p{n}" / "legacy"
    audit_dir = PUB / f"p{n}" / "audit"
    audit_dir.mkdir(parents=True, exist_ok=True)

    pdf_bytes = pdf.read_bytes()
    msha = sha_bytes(pdf_bytes)
    text = extract_text(pdf)
    secs = section_map(text)
    tokens_present = [t for t in STMT_TOKENS[n] if t in text or t.replace("\\", "") in text]
    # Builder read each manuscript's restated problem ("Đề bài") and confirmed it is
    # the same official problem (entities, quantities, and the question). This is a
    # statement-level structural match only; rigorous line-by-line semantic match is
    # deferred to the independent verifier rubric. Not a proof-correctness claim.
    match = "MATCH"

    manifest = []
    def put(rel_dir, name, content_str, binary=None):
        p = rel_dir / name
        if binary is not None:
            p.write_bytes(binary); h = sha_bytes(binary)
        else:
            p.write_text(content_str); h = sha_text(content_str)
        manifest.append((f"{rel_dir.name}/{name}", h)); return h

    # ---- legacy/ ----
    put(legacy_dir, "manuscript.sha256", f"{msha}  {fn}\n")
    # Provenance-scope correction (Contractor): custody/history is documented, but the
    # ORIGINAL AUTHOR of each manuscript is not established. Do not imply authorship.
    prov = {"problem_id": pid, "filename": fn, "sha256": msha,
            "original_path": f"{ORIG_DIR}/{fn}", "created_at": "2026-07-16",
            "size_bytes": len(pdf_bytes),
            "provenance_status": "PARTIAL",
            "artifact_custody_provenance": "DOCUMENTED",
            "authorship_provenance": "UNKNOWN",
            "claimed_authors": [],
            "authorship_note": "Artifact history and custody are documented (path, date, size, SHA-256, file predates this session, and this Builder session did not create it). Original authorship is NOT established.",
            "self_label": "Independent HIVE-IMO X manuscript; explicitly not an official IMO solution."}
    put(legacy_dir, "manuscript_provenance.json", json.dumps(prov, ensure_ascii=False, indent=2) + "\n")
    put(legacy_dir, "extraction.txt", text)
    put(legacy_dir, "section_map.json", json.dumps({"problem_id": pid, "sections": secs}, ensure_ascii=False, indent=2) + "\n")
    exp = exposure(pid)
    put(legacy_dir, "exposure_ledger.json", json.dumps(exp, ensure_ascii=False, indent=2) + "\n")

    # ---- audit/ ----
    obligations = [{"id": o[0], "claim": o[1], "status": "CLAIMED", "dependencies": o[2],
                    "load_bearing": o[3], "notes": ""} for o in OBLIG[n]]
    lemmas = [{"id": o["id"], "claim": o["claim"], "status": "CLAIMED", "load_bearing": o["load_bearing"]}
              for o in obligations if o["load_bearing"]]
    dep_edges = [{"from": d, "to": o["id"]} for o in obligations for d in o["dependencies"]]
    load_steps = [{"id": o["id"], "claim": o["claim"]} for o in obligations if o["load_bearing"]]

    spec = {"problem_id": pid, "day": 1 if n <= 3 else 2, "number": n,
            "official_statement_source": "https://www.imo-official.org/problems/?language=en",
            "official_raw_page_sha256": RAW_SHA, "manuscript_sha256": msha,
            "statement_match": match, "statement_match_method": "Builder read the manuscript's restated problem and confirmed the same official problem (entities, quantities, question). Statement-level only; line-by-line semantic match deferred to the independent verifier. Not a proof-correctness claim.",
            "statement_tokens_expected": STMT_TOKENS[n], "statement_tokens_found": tokens_present}
    put(audit_dir, "problem_specification.json", json.dumps(spec, ensure_ascii=False, indent=2) + "\n")
    put(audit_dir, "proof_obligations.json", json.dumps({"problem_id": pid, "obligations": obligations}, ensure_ascii=False, indent=2) + "\n")
    put(audit_dir, "lemma_ledger.json", json.dumps({"problem_id": pid, "lemmas": lemmas}, ensure_ascii=False, indent=2) + "\n")
    put(audit_dir, "dependency_graph.json", json.dumps({"problem_id": pid, "nodes": [o["id"] for o in obligations], "edges": dep_edges, "acyclic": True}, ensure_ascii=False, indent=2) + "\n")
    put(audit_dir, "load_bearing_steps.json", json.dumps({"problem_id": pid, "steps": load_steps}, ensure_ascii=False, indent=2) + "\n")

    vip = {"problem_id": pid,
           "purpose": "Clean input for a FRESH independent verifier (no prior exposure).",
           "provides": ["official frozen problem statement (EN)", f"legacy manuscript PDF ({fn})",
                        "proof-obligation skeleton WITHOUT verdicts", "audit rubric (to be supplied by Contractor)"],
           "excludes": ["search history / discussion", "prior self-assessments ('coherent' etc.)",
                        "Sol's conclusions", "any suspected-error list", "any repair suggestions"],
           "files": {"official_statement": f"/imo2026/p{n}/official/problem_en.md",
                     "manuscript": f"/imo2026/p{n}/legacy/{fn}",
                     "proof_obligations": f"/imo2026/p{n}/audit/proof_obligations.json"}}
    put(audit_dir, "verifier_input_manifest.json", json.dumps(vip, ensure_ascii=False, indent=2) + "\n")
    astat = {"problem_id": pid, "audit_status": "RECONCILED", "proof_audit": "NOT-STARTED",
             "reconciled_by": "Fable (Builder)", "reconciled_at": UPDATED,
             "note": "Reconciliation only. No obligation has been verified. Independent audit not started; not authorized for P1 yet."}
    put(audit_dir, "audit_status.json", json.dumps(astat, ensure_ascii=False, indent=2) + "\n")

    # ---- consolidated schema-conforming record ----
    record = {"problem_id": pid,
              "manuscript": {"filename": fn, "sha256": msha, "created_at": "2026-07-16",
                             "original_path": f"{ORIG_DIR}/{fn}", "provenance_status": "PARTIAL", "claimed_authors": []},
              "official_binding": {"source_sha256": RAW_SHA, "statement_match": match},
              "exposure": {k: exp[k] for k in ("human", "sol", "fable")},
              "proof_obligations": obligations,
              "audit_status": "RECONCILED"}
    rsha = put(audit_dir, "legacy_audit_record.json", json.dumps(record, ensure_ascii=False, indent=2) + "\n")

    # per-problem manifest (paths relative to p{n}/, covering legacy/ + audit/)
    body = "".join(f"{h}  {rel}\n" for rel, h in manifest)
    (audit_dir.parent / "RECONCILIATION.sha256").write_text(body)
    records.append((pid, record, rsha, match, len(obligations), sum(1 for o in obligations if o["load_bearing"])))

    # patch ledger with reconciliation summary (audit count unchanged)
    recpath = DATA / f"{pid}.json"
    led = json.loads(recpath.read_text())
    led["reconciliation"] = {"state": "RECONCILED", "obligations": len(obligations),
                             "load_bearing": sum(1 for o in obligations if o["load_bearing"]),
                             "statement_match": match, "audit_dir": f"/imo2026/p{n}/audit/",
                             "record_sha256": rsha, "reconciled_at": UPDATED}
    led["internal_prior_solution_exposure"] = True
    recpath.write_text(json.dumps(led, ensure_ascii=False, indent=2) + "\n")

# framework provenance
fw = PUB / "legacy" / "HIVE_IMO_X_Framework.pdf"
fwb = fw.read_bytes()
(PUB / "legacy" / "HIVE_IMO_X_Framework.provenance.json").write_text(json.dumps({
    "filename": "HIVE_IMO_X_Framework.pdf", "sha256": sha_bytes(fwb), "created_at": "2026-07-16",
    "original_path": f"{ORIG_DIR}/HIVE_IMO_X_Framework.pdf", "provenance_status": "DOCUMENTED",
    "note": "Framework distilled from the Day-1 solving process. Builder did not author it in this session."
}, ensure_ascii=False, indent=2) + "\n")

# schema check (lightweight)
schema_req = ["problem_id", "manuscript", "official_binding", "exposure", "proof_obligations", "audit_status"]
allowed_status = {"UNPARSED", "CLAIMED"}
errs = []
for pid, rec, rsha, match, nob, nlb in records:
    for k in schema_req:
        if k not in rec: errs.append(f"{pid}: missing {k}")
    for o in rec["proof_obligations"]:
        if o["status"] not in allowed_status:
            errs.append(f"{pid}: obligation {o['id']} has forbidden status {o['status']} (Builder may only use UNPARSED/CLAIMED)")
    if not re.match(r"^[a-f0-9]{64}$", rec["manuscript"]["sha256"]): errs.append(f"{pid}: bad sha")

print("=== S0-R reconciliation ===")
for pid, rec, rsha, match, nob, nlb in records:
    print(f"  {pid}: statement_match={match}  obligations={nob} (load-bearing {nlb})  record {rsha[:12]}…  status=RECONCILED")
print("schema/builder-scope check:", "PASS" if not errs else "FAIL " + "; ".join(errs))
print("audit count unchanged: 0/6 (no VERIFIED states created)")
