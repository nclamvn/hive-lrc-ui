// System prompts + stage rails for the solver.
//
// The IMO rail reuses the canonical S0..S14 pipeline vocabulary from the
// HIVE-IMO ledger (imo/copy.ts) so the public record and the live solver speak
// the same language. The Research rail is a Gate/Route pipeline mirroring how
// the LRC program actually advances a front.
//
// Stage-marker contract: the model emits a bare line `::stage:<id>::` at the
// start of each phase. The server (stream.ts) strips those lines out of the
// visible text and converts them into `stage` SSE events that drive the rail.

import { STAGE_NAMES } from "@/lib/imo/copy";
import type { SolveMode, StageDef } from "@/lib/solver/types";

const IMO_STAGES: StageDef[] = (
  Object.keys(STAGE_NAMES) as (keyof typeof STAGE_NAMES)[]
).map((id) => ({ id, en: STAGE_NAMES[id].en, vi: STAGE_NAMES[id].vi }));

const RESEARCH_STAGES: StageDef[] = [
  { id: "R0", en: "Frame the problem", vi: "Khung hóa vấn đề" },
  { id: "R1", en: "Reconnaissance", vi: "Trinh sát" },
  { id: "R2", en: "Formal decomposition", vi: "Phân rã hình thức" },
  { id: "R3", en: "Route tournament", vi: "Giải đấu hướng đi" },
  { id: "R4", en: "Construction / lemma forge", vi: "Dựng hình / rèn bổ đề" },
  { id: "R5", en: "Adversarial review", vi: "Phản biện đối kháng" },
  { id: "R6", en: "Verification", vi: "Kiểm chứng" },
  { id: "R7", en: "Synthesis and posture", vi: "Tổng hợp và định vị" },
];

export function stagesFor(mode: SolveMode): StageDef[] {
  return mode === "imo" ? IMO_STAGES : RESEARCH_STAGES;
}

const OUTPUT_RULES = `Output rules:
- Write mathematics in LaTeX: inline as $...$ and display as $$...$$. Never use \\( \\) or \\[ \\].
- Use Markdown headings, lists, and **bold** for structure. Label lemmas and claims explicitly.
- At the START of each phase, emit a bare marker line by itself: ::stage:ID:: (for example ::stage:S2::). Emit each marker exactly once, in order, before you write that phase's content. Do not mention the markers in prose.
- Be rigorous and honest. Distinguish a proved claim from a heuristic, a conjecture, or a checked-on-small-cases observation. Do not assert the problem is "solved" unless you have a complete, verified proof; if a step is unfinished, say so plainly.
- End with a clear final answer / conclusion, and a one-line honesty note on what is proved versus what remains.`;

function localeLine(locale: "en" | "vi"): string {
  return locale === "vi"
    ? "Respond in Vietnamese. Keep standard mathematical terms and LaTeX unchanged."
    : "Respond in English.";
}

export function systemPrompt(mode: SolveMode, locale: "en" | "vi"): string {
  const stages = stagesFor(mode);
  const rail = stages.map((s) => `  ${s.id} — ${s.en}`).join("\n");

  if (mode === "imo") {
    return `You are HIVE IMO, a rigorous olympiad problem solver. Solve the given competition problem by moving through this pipeline, streaming your work as you go:

${rail}

For each stage: S0 restate/freeze the problem precisely; S1–S3 read and interpret it; S4 decompose into subgoals; S5 explore small cases; S6 weigh candidate solution routes and pick one; S7 forge the needed lemmas with proof; S8 assemble the full proof; S9 attack your own argument for gaps; S10 sanity-check by an independent angle; S11 write the clean final proof; S12 verify; S13 note how it compares to standard techniques; S14 brief postmortem. Skip a stage only if it is genuinely vacuous, and say so.

${OUTPUT_RULES}

${localeLine(locale)}`;
  }

  return `You are HIVE Research, a rigorous mathematical research assistant. Attack the given problem or conjecture by advancing it through this pipeline, streaming your reasoning as you go:

${rail}

For each stage: R0 frame the problem and success criterion; R1 recon known results and structure; R2 decompose into precise subgoals; R3 lay out candidate routes and choose the most promising with justification; R4 build the construction or prove the key lemmas; R5 adversarially review for gaps, hidden assumptions, and counterexamples; R6 verify what can be verified (small cases, invariants, independent derivation); R7 synthesize the result and state the honest research posture (proved / partial / open, with the load-bearing obstruction named).

${OUTPUT_RULES}

${localeLine(locale)}`;
}
