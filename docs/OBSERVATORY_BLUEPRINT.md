# HIVE-LRC Observatory — Public Portal Product Blueprint

> A live, verifiable record of a Human–AI attack on the Lonely Runner Conjecture.

Status: DRAFT v1 (Builder-authored, awaiting Owner approval). This document locks the
sitemap, public data contract, event model, graph ontology, publication workflow, and
acceptance criteria **before** any build begins. Nothing here publishes anything; it is a
spec artifact.

The strategic brief that motivated this blueprint is accepted in its core: split the system
into a private **Research Console** and a public **Observatory**, and lock the data contract +
governance before building the graph. Sections marked **[BUILDER DELTA]** are places where I,
as Builder, recommend diverging from the brief on engineering grounds.

---

## 0. Non-negotiable invariants

1. LRC(13) is OPEN. Every public page carries the standing footer:
   > Research status: LRC(13) remains open. This page reports intermediate internal results
   > under the displayed evidence and scope.
2. No public claim is authorized beyond what an approved release explicitly permits.
3. Evidence ceiling is I2 (two same-author implementations). The Observatory must never let a
   reader infer I3 (independent-team) or formal verification where none exists.
4. Physical separation, not just logical: the public app has **no read path** into the private
   research store. It reads only a generated, reviewed dataset. (See §4, [BUILDER DELTA].)
5. Corrections and withdrawals are first-class and displayed at parity with new theorems.

---

## 1. Two surfaces

| Surface | Audience | Contents | Deploy |
| --- | --- | --- | --- |
| **Research Console** (existing) | Owner, Contractor, Builder | raw logs, unpublished claims, failed branches, verifier stdout, machine resources, local paths, internal risk, Builder state, low-evidence conjecture | private, unchanged |
| **Observatory** (new) | public | curated projection: overview, gates, claims, methods, verification, journal, research map | public, static-first |

The Console is renamed conceptually to **HIVE-LRC Research Console**; the public product is
**HIVE-LRC Observatory**. They share the design system (black sidebar, ivory canvas, serif/sans
pairing, hairline rules, monochrome, hexagon honeycomb motif) but differ in purpose and data source.

---

## 2. Sitemap (public routes)

Locale-prefixed (`/en`, `/vi`), App Router, statically generated.

```
/(public)/[locale]
  /                      Overview (KPI row, research map preview, live feed, arc, bottleneck)
  /map                   Research Attack Map (full interactive graph, 3 zoom levels)
  /gates                 Gate index (D0 … D16, status chips)
  /gates/[id]            Gate publication record (fixed template, §11)
  /claims                Public claim ledger (filter by status/evidence/scope)
  /claims/[id]           Single claim: statement, plain-language, deps, artifacts, history
  /methods               Method library (evolution of the attack architecture)
  /methods/[id]          Single method page
  /verification          Certificates, verifiers, manifests, corruption summaries
  /verification/[artifactId]  Single artifact (hash, verifier status, download policy)
  /journal               Edited explainers, technical reports, changelog
  /journal/[slug]        Single journal entry
  /about                 Project framing, roles, methodology, governance, disclaimers
```

NOT in public navigation: `settings`, raw `resources`, campaign controls, Builder state, internal risk.

---

## 3. Reading modes  **[BUILDER DELTA]**

The brief proposes a global three-mode switch (Understand / Explore / Audit). I recommend
**two axes instead of three duplicated content sets**, to avoid tripling authoring/maintenance:

- **Depth toggle** in the header: `Read` ↔ `Audit`.
  - `Read` = plain-language + curated visuals (the brief's Understand).
  - `Audit` = exact scope, verifier status, manifests, SHA, withdrawn claims, correction notices
    (the brief's Audit).
- **Explore** is not a mode; it is the `/map` page and the interactive filters on `/claims`.
  Interactivity lives where it belongs rather than as a global content fork.

Every entity (gate, claim, method) authors exactly two fields — `summary_public` and
`summary_technical` — never three. Progressive disclosure within a page handles the middle ground.

---

## 4. Public data contract

**[BUILDER DELTA] — the public read model is a generated, versioned dataset, not a live DB.**
It is produced by a build-time projector that reads the private research state + the existing
`src/data/wiki/*` and emits immutable, hash-addressed JSON snapshots under `public/observatory/`.
The public app imports only these snapshots. There is no runtime connection to any private store.

Entities (JSON schemas; all timestamps ISO-8601 UTC; all `scope` fields are free-text exact scope):

### `public_releases`
```
id                    REL-D16-001
sequence              integer, monotonic
title                 short headline
summary_public        plain-language, 1–3 sentences
summary_technical     exact, with formula/scope
published_at
gate_id               D16
change_type           THEOREM_PROVED | CLAIM_UPDATED | CLAIM_WITHDRAWN |
                      COUNTEREXAMPLE_FOUND | GATE_OPENED | GATE_CLOSED |
                      RISK_OPENED | RISK_CLOSED | CERTIFICATE_VERIFIED |
                      ARTIFACT_PUBLISHED | ARCHITECTURE_CHANGED
evidence_level        I0 | I1 | I2 | I3 | formal
scope                 exact scope string
owner_approved_at     REQUIRED — no release without it
manifest_hash         sha256 of the release payload
supersedes_release_id nullable
affected              ["gate:D16","claim:C-D15-...","graph:main"]
```

### `public_claims`
```
claim_id | statement | plain_language_statement | status | evidence_level | scope |
novelty_status | gate_introduced | gate_last_changed | depends_on[] | supersedes |
superseded_by | public_artifacts[] | last_verified_at
status ∈ { proved_internal, validated_exact, validated_bounded, supported_internal,
           supported_conditional, provisional, refuted, superseded, open, external_claim }
```

### `public_graph_nodes`
```
id | kind | label | short_label | status | evidence | scope | gate | summary |
technical_summary | route | valid_from_release | valid_to_release (nullable)
kind ∈ { gate, claim, theorem, method, risk, certificate, artifact }
```

### `public_graph_edges`
```
id | source | target | relation | status | explanation | artifact_id (nullable) |
valid_from_release | valid_to_release (nullable)
relation ∈ { supports, depends_on, refutes, supersedes, verifies, blocks, reduces_to, generalizes }
```

### `public_artifacts`
```
artifact_id | type | title | description | sha256 | verification_status | created_at |
published_at | size | source_gate | download_policy
download_policy ∈ { public, on_request, metadata_only }
```

`valid_from_release` / `valid_to_release` on nodes and edges are what make the map **time-travel**:
the timeline slider (§6) filters the graph to the set of nodes/edges live at a chosen release.

---

## 5. Event / release model  **[BUILDER DELTA on transport]**

The brief proposes Supabase Realtime broadcast. For this project's actual cadence (a handful of
releases per gate, days apart) a streaming DB is operational overkill and adds a live dependency
that undercuts the "every public state is an auditable artifact" ethos. Recommended model:

```
Approved release  →  append to public_releases + regenerate affected snapshots
                  →  on-demand revalidation / rebuild of affected static routes
                  →  clients fetch the new immutable snapshot (hash-addressed)
```

- **Default: static-first.** Each approved release triggers an incremental static regeneration
  (Next.js on-demand revalidation or a rebuild webhook). Public state = immutable build artifact.
- **Optional liveness layer (only if sub-minute updates are ever wanted):** a single append-only
  `public_releases` feed the Overview page subscribes to (poll every N seconds, or one broadcast
  channel carrying *only* `{event, releaseId, affected, publishedAt}`). The client then fetches the
  reviewed snapshot — never raw content over the wire. This matches the brief's "broadcast the event,
  fetch the snapshot" pattern without streaming the private DB.

Either way: **no client ever subscribes to internal tables.** The liveness layer, if built, carries
release IDs only.

---

## 6. Graph ontology & interaction (the flagship)

Three linked levels, one library.

- **L1 Program Map** — the whole attack (LRC(13) → tight / non-tight interfaces → method chain).
- **L2 Claim Dependency Graph** — claims + relations (`supports`, `depends_on`, `refutes`,
  `supersedes`, `blocks`, `reduces_to`, `verifies`, `generalizes`).
- **L3 Gate Micrograph** — opening a gate reveals its internal derivation DAG.

**Monochrome status encoding (no color — shape/stroke/fill only):**

| Meaning | Encoding |
| --- | --- |
| Proved | solid black stroke, filled edge |
| Verified computationally | double ring |
| Provisional | dotted stroke |
| Refuted | node with diagonal strike |
| Superseded | dimmed node, edge to successor |
| Open | thin stroke, white fill |
| Blocked | hatch fill |
| Risk | triangle |
| Certificate | hexagon |
| Gate | large circle |
| Artifact | document glyph |

Interactions: zoom/pan, focus a node (isolate ancestors+descendants), hide unrelated branches,
timeline slider (uses `valid_from/to_release`), Gate-diff compare (e.g. D8 vs D15), edge click →
dependency explanation, "Why does this matter?" / "What would close this node?" popovers, and the
`Read`/`Audit` depth toggle re-labeling node captions.

**[BUILDER DELTA] — library choice: consolidate to two, not four.**
- **Cytoscape.js** for L1/L2/L3 (real graph theory: directed, compound nodes for gate micrographs,
  traversal, filtering, JSON-serializable — fed directly by `public_graph_*`).
- **Observable Plot** for charts (compression lens, prime inventory, verifier/margin/threshold series).
- Drop React Flow and D3 from the baseline. Reasons: one graph paradigm keeps the monochrome visual
  DNA consistent and halves maintenance. Reintroduce a D3-force module only if a specific narrative
  visual demands physics that Cytoscape layouts cannot express — decided per-visual, not up front.

---

## 7. Gate publication record (fixed template)  `/gates/[id]`

```
Headline        Gate Dn · Title · Status · Evidence · Public claim (yes/no)
What changed    80–120 words, plain language
Result          exact statement, formula, scope
Why it matters  architectural role
Corrected/refuted   e.g. "9/1000 support-3 threshold superseded by 1/100 (then 11/1000)"
Evidence        verifier status · corruption tests · prime scope · exact arithmetic · artifact hashes
Open            the single remaining obligation (or a small explicit set)
Graph impact    mini animation: nodes/edges added, changed, withdrawn
```

Source of truth: the existing `src/data/wiki/gates.ts` already carries bilingual title, status,
verify level, independence, date, summary, checks, artifacts. The projector maps this into the gate
record; the only NEW authored fields per gate are `what_changed`, `why_it_matters`, `corrected`, and
`open_obligation`. This makes Phase-2 cheap.

---

## 8. Publication governance (hard gates)

No content reaches the public read model unless it passes all five:

```
P1  Mathematical scope correct
P2  Evidence label correct
P3  No private path / raw secret / credential / machine metadata
P4  Public explanation reviewed
P5  Owner approval (owner_approved_at set)
```

Automatic-publish is prohibited for: local paths (`/Users/os/...`), raw logs, credentials, sensitive
machine metadata, Builder speculation, unreviewed claims, non-normalized benchmarks, and anything a
reader could read as "LRC(13) solved." The projector runs an automated P3 scan (regex/deny-list) and
refuses to emit a snapshot containing a filesystem path, hash of a private file, or a `status` above
the release's approved evidence level.

---

## 9. Overview homepage layout

KPI row (each card: `Status · Evidence · Updated · Public scope`):
```
Target                     LRC(13) · 14 runners
Current Research Gate       Gate D16 · Modular Rank Repair
Highest Independent Reproduction   k = 9
Latest Structural Advance   Support-3 complete over the full universe
```
**[BUILDER DELTA]** — split the single "Best Verified Result" into two KPIs exactly as the brief
urges: *Highest Independently Reproduced* (k=9, honest I1/independent) vs *Latest Internal Structural
Result* (Gate D16, I2). This is the most important correctness fix on the current dashboard for a
public audience and should ship in Phase 2 regardless of the rest.

Center: Research Attack Map preview (~70%) + Live Verified Research Feed (~30%, edited, 3 layers:
headline / plain-language / technical). Below: research arc D0→D16, latest theorem cards, refuted
routes, current bottleneck, verification health, featured explainer, artifact release stream.

---

## 10. Signature explainer visuals (Observable Plot / static SVG)

- **Compression Lens** — 14^13 tight states → 16,171 orbit classes → closed at p=191 → all p>182.
- **Method Evolution** — enumeration → certificates → CRT witness → Fourier mass → punctured moments
  → ratio graph → relation hypergraph → projective directions → modular rank; each transition annotated
  "why the previous method stopped / what the new representation exposed."
- **Evidence Ladder** — observation → measured → validated-bounded → supported-internal I2 →
  independent audit → formal verification (current work sits at I2).
- **Gate Diff** — compare two gates: claims added/withdrawn, dependencies changed, risks closed,
  new bottleneck.

---

## 11. Build phases (locked order)

```
Phase 1  Public read model + projector + publication governance (P1–P5), P3 scanner.
         Generate public_graph_* from gates.ts/content.ts. NO UI yet.
Phase 2  Public shell: route groups, Overview (with the two-KPI split), gate pages, claim pages,
         journal — reusing the current design system.
Phase 3  Release ledger + (optional) liveness layer — approved releases only.
Phase 4  Research Attack Map (Cytoscape): L1/L2/L3, timeline, focus, gate-diff.
Phase 5  Explainer visuals (Compression Lens, Method Evolution, Evidence Ladder, Gate Diff).
Phase 6  Audit portal: artifact hashes, manifests, verifier results, corruption summaries, downloads.
```

Rationale (agreeing with the brief): do NOT start with graph animation. A beautiful graph over an
untrustworthy or unreviewed dataset is worse than no graph. Lock the data contract + governance first.

---

## 12. Acceptance criteria

- [ ] Public app builds with **zero** imports from private research stores; only `public/observatory/*`.
- [ ] P3 scanner blocks any snapshot containing a filesystem path, private-file hash, or over-scoped status.
- [ ] Every gate/claim page renders both `summary_public` and `summary_technical`; `Read`/`Audit` toggle works.
- [ ] Every public page shows the LRC(13)-open footer.
- [ ] KPI row separates independent reproduction (k=9) from internal structural result (Gate D16).
- [ ] Corrections/withdrawals (e.g. C-D15 superseded, Q-rank withdrawn) appear at parity with theorems.
- [ ] Research Map renders from `public_graph_*`, monochrome status encoding, timeline reflects
      `valid_from/to_release`, gate-diff works for at least D8↔D15.
- [ ] No release appears publicly without `owner_approved_at`.
- [ ] i18n key parity EN/VI holds (existing test gate extended to public content).
- [ ] Existing visual-regression + a11y gates extended to the public surface.

---

## 13. Owner decisions — LOCKED (2026-07-18)

1. **Liveness**: ✅ **Static-first.** Each approved release regenerates immutable, hash-addressed
   snapshots and rebuilds affected static routes. No Supabase / live DB. (Matches [BUILDER DELTA] §5.)
2. **Reading modes**: ✅ **Two-axis `Read`/`Audit`** toggle; Explore = the `/map` page. Each entity
   authors exactly `summary_public` + `summary_technical`. (Matches [BUILDER DELTA] §3.)
3. **Graph libraries**: ✅ **Full four-library set** — Cytoscape.js (dependency L1/L2/L3), React Flow
   (curated workflow micrographs), Observable Plot (charts), D3 (special narrative visuals). Owner
   overrode the Builder consolidation; all four are in scope. Each library owns a clearly-bounded
   surface to contain the maintenance cost: Cytoscape = data-driven dependency graphs; React Flow =
   hand-curated gate derivation diagrams; Plot = metrics; D3 = Compression Lens / bespoke visuals.
4. **Hosting/repo**: same Next.js app, route groups `(public)` / `(research)` (shared design system).
5. **First public cut**: ✅ **Full D0–D16 at once.** All gates public in the first release; full
   governance review (P1–P5) required across the whole arc before launch.
```
```
