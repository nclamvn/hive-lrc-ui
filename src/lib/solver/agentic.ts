// Agentic pipeline: one Claude call per pipeline stage, each seeing the problem
// plus a digest of prior stages, streamed as that stage advances. After the
// construction/proof stage, a FRESH-CONTEXT verifier (its own call, no prior
// reasoning, structured output) judges the key claim and emits a verdict.
//
// Real-model only, and gated by PIPELINE_MODE=agentic — it makes ~N calls per
// solve (N = stage count), so it is opt-in and never the default cost profile.

import Anthropic from "@anthropic-ai/sdk";
import { stagesFor } from "@/lib/solver/prompts";
import type { SolveEvent, SolveMode, SolveRequest, StageDef } from "@/lib/solver/types";

const DIGEST_CHARS = 6000;

function localeLine(locale: "en" | "vi"): string {
  return locale === "vi"
    ? "Respond in Vietnamese; keep math terms and LaTeX unchanged."
    : "Respond in English.";
}

function stageSystem(mode: SolveMode, s: StageDef, locale: "en" | "vi"): string {
  const fam = mode === "imo" ? "HIVE IMO olympiad" : "HIVE Research";
  return `You are executing exactly ONE stage of the ${fam} solving pipeline: ${s.id} — ${s.en}.
Do only this stage's job and hand off to the next stage; do not attempt the whole solution at once, and do not emit any stage markers.
Write mathematics in LaTeX ($...$ inline, $$...$$ display). Be rigorous and honest: separate a proved claim from a heuristic or conjecture. Label any lemma/theorem/claim in bold (e.g. **Lemma 1.**) and its proof with **Proof.**.
${localeLine(locale)}`;
}

function firstStageContent(req: SolveRequest): Anthropic.ContentBlockParam[] {
  const blocks: Anthropic.ContentBlockParam[] = [];
  for (const a of req.attachments ?? []) {
    if (a.kind === "image") {
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: a.mediaType as "image/png" | "image/jpeg" | "image/gif" | "image/webp",
          data: a.dataBase64,
        },
      });
    } else {
      blocks.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: a.dataBase64 },
      });
    }
  }
  blocks.push({ type: "text", text: req.problem.trim() || "(no problem text provided)" });
  return blocks;
}

const VERDICT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: { type: "string", enum: ["verified", "refuted", "unverified"] },
    note: { type: "string" },
  },
  required: ["status", "note"],
} as const;

async function verify(
  client: Anthropic,
  req: SolveRequest,
  claimText: string,
  signal?: AbortSignal,
): Promise<{ status: "verified" | "refuted" | "unverified"; note: string; out: number; in: number }> {
  const res = await client.messages.create(
    {
      model: "claude-opus-4-8",
      max_tokens: 4000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: { type: "json_schema", schema: VERDICT_SCHEMA } },
      system:
        "You are an independent verifier with NO access to the solver's reasoning. Given a problem and a specific claimed lemma/step, decide whether the claim is correct. Be skeptical; if you cannot confirm it, return \"unverified\". Keep the note to one sentence.",
      messages: [
        {
          role: "user",
          content: `Problem:\n${req.problem}\n\nClaim to check:\n${claimText}`,
        },
      ],
    },
    { signal },
  );
  const block = res.content.find((b) => b.type === "text");
  let status: "verified" | "refuted" | "unverified" = "unverified";
  let note = "";
  try {
    const parsed = JSON.parse(block && block.type === "text" ? block.text : "{}");
    if (parsed.status === "verified" || parsed.status === "refuted") status = parsed.status;
    note = typeof parsed.note === "string" ? parsed.note : "";
  } catch {
    /* leave defaults */
  }
  return { status, note, out: res.usage.output_tokens, in: res.usage.input_tokens };
}

export async function runAgenticStream(
  req: SolveRequest,
  emit: (event: SolveEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const client = new Anthropic();
  const stages = stagesFor(req.mode);
  const proofId = req.mode === "imo" ? "S8" : "R4";

  let digest = "";
  let totalIn = 0;
  let totalOut = 0;

  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    emit({ type: "stage", id: s.id, status: "active" });
    emit({ type: "text", delta: `\n## ${s.id} · ${s.en}\n\n` });

    const content: Anthropic.ContentBlockParam[] =
      i === 0
        ? firstStageContent(req)
        : [
            {
              type: "text",
              text: `Problem:\n${req.problem}\n\nWork so far (digest):\n${digest.slice(-DIGEST_CHARS)}\n\nNow perform stage ${s.id} — ${s.en}.`,
            },
          ];

    const stream = client.messages.stream(
      {
        model: "claude-opus-4-8",
        max_tokens: 8000,
        thinking: { type: "adaptive", display: "summarized" },
        output_config: { effort: "high" },
        system: stageSystem(req.mode, s, req.locale),
        messages: [{ role: "user", content }],
      },
      { signal },
    );

    let stageText = "";
    for await (const ev of stream) {
      if (ev.type === "content_block_delta") {
        if (ev.delta.type === "thinking_delta") {
          emit({ type: "thinking", delta: ev.delta.thinking });
        } else if (ev.delta.type === "text_delta") {
          stageText += ev.delta.text;
          emit({ type: "text", delta: ev.delta.text });
        }
      }
    }
    const final = await stream.finalMessage();
    totalIn += final.usage.input_tokens;
    totalOut += final.usage.output_tokens;
    digest += `\n[${s.id} ${s.en}]\n${stageText}\n`;

    // Fresh-context verification of the construction/proof stage's key claim.
    if (s.id === proofId && stageText.trim()) {
      const vid = `v-${s.id}`;
      emit({
        type: "verdict",
        verdict: { id: vid, claim: `${s.id} — ${s.en}`, status: "checking", stage: s.id },
      });
      try {
        const v = await verify(client, req, stageText.slice(0, 4000), signal);
        totalIn += v.in;
        totalOut += v.out;
        emit({
          type: "verdict",
          verdict: { id: vid, claim: `${s.id} — ${s.en}`, status: v.status, note: v.note, stage: s.id },
        });
      } catch {
        emit({
          type: "verdict",
          verdict: { id: vid, claim: `${s.id} — ${s.en}`, status: "unverified", stage: s.id },
        });
      }
    }

    emit({ type: "stage", id: s.id, status: "done" });
  }

  emit({ type: "usage", input: totalIn, output: totalOut });
}
