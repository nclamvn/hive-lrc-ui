// Server-side streaming helpers shared by the real and mock solve paths.
//
//  - sseFrame:        encode a SolveEvent as one SSE `data:` frame.
//  - MarkerSplitter:  split a text stream into visible text + ::stage:ID::
//                     markers, tolerant of markers arriving across delta chunks.
//  - runClaudeStream: drive a real claude-opus-4-8 streaming completion and
//                     emit SolveEvents.

import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "@/lib/solver/prompts";
import type { SolveEvent, SolveRequest } from "@/lib/solver/types";

const encoder = new TextEncoder();

export function sseFrame(event: SolveEvent): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

const MARKER_RE = /::stage:([A-Za-z0-9_-]+)::/;

// Splits a streamed text into visible-text deltas and stage transitions.
// Holds back a trailing partial marker so a marker split across two chunks is
// never leaked into the visible transcript.
export class MarkerSplitter {
  private buf = "";

  feed(
    chunk: string,
    onText: (delta: string) => void,
    onStage: (id: string) => void,
  ): void {
    this.buf += chunk;
    // Extract every complete marker; emit intervening text.
    for (;;) {
      const m = MARKER_RE.exec(this.buf);
      if (!m) break;
      const before = this.buf.slice(0, m.index);
      if (before) onText(before);
      onStage(m[1]);
      this.buf = this.buf.slice(m.index + m[0].length);
    }
    // No complete marker left. Emit the safe prefix, keep any possible
    // partial-marker tail buffered for the next chunk.
    const hold = this.holdbackIndex(this.buf);
    if (hold > 0) {
      onText(this.buf.slice(0, hold));
      this.buf = this.buf.slice(hold);
    }
  }

  // Flush whatever remains (called once the stream ends).
  flush(onText: (delta: string) => void): void {
    if (this.buf) {
      onText(this.buf);
      this.buf = "";
    }
  }

  private holdbackIndex(buf: string): number {
    const at = buf.lastIndexOf("::");
    if (at === -1) {
      return buf.endsWith(":") ? buf.length - 1 : buf.length;
    }
    const tail = buf.slice(at); // starts with "::"
    if ("::stage:".startsWith(tail) || tail.startsWith("::stage:")) {
      return at; // possible marker in progress — hold it back
    }
    return buf.length;
  }
}

function userContent(req: SolveRequest): Anthropic.ContentBlockParam[] {
  const blocks: Anthropic.ContentBlockParam[] = [];
  for (const a of req.attachments ?? []) {
    if (a.kind === "image") {
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: a.mediaType as
            | "image/png"
            | "image/jpeg"
            | "image/gif"
            | "image/webp",
          data: a.dataBase64,
        },
      });
    } else {
      blocks.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: a.dataBase64,
        },
      });
    }
  }
  blocks.push({
    type: "text",
    text: req.problem.trim() || "(no problem text provided)",
  });
  return blocks;
}

// Runs a real Claude stream and emits SolveEvents until completion.
export async function runClaudeStream(
  req: SolveRequest,
  emit: (event: SolveEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
  const splitter = new MarkerSplitter();

  const stream = client.messages.stream(
    {
      model: "claude-opus-4-8",
      max_tokens: 64000,
      thinking: { type: "adaptive", display: "summarized" },
      output_config: { effort: "high" },
      system: systemPrompt(req.mode, req.locale),
      messages: [{ role: "user", content: userContent(req) }],
    },
    { signal },
  );

  for await (const event of stream) {
    if (event.type === "content_block_delta") {
      if (event.delta.type === "thinking_delta") {
        emit({ type: "thinking", delta: event.delta.thinking });
      } else if (event.delta.type === "text_delta") {
        splitter.feed(
          event.delta.text,
          (delta) => emit({ type: "text", delta }),
          (id) => emit({ type: "stage", id, status: "active" }),
        );
      }
    }
  }

  splitter.flush((delta) => emit({ type: "text", delta }));

  const final = await stream.finalMessage();
  emit({
    type: "usage",
    input: final.usage.input_tokens,
    output: final.usage.output_tokens,
  });
}
