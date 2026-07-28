// POST /api/solve — streams the solve process as Server-Sent Events.
//
// Private tool: the ANTHROPIC_API_KEY lives only here (server env) and is never
// shipped to the client. An optional shared-secret gate (SOLVER_ACCESS_SECRET)
// prevents public token burn if the app is deployed. The USE_REAL_MODEL flag
// switches between the real claude-opus-4-8 stream and the zero-token mock;
// both emit the identical SolveEvent protocol.

import { runClaudeStream, sseFrame } from "@/lib/solver/stream";
import { runAgenticStream } from "@/lib/solver/agentic";
import { runMockStream } from "@/lib/solver/mock";
import type { SolveEvent, SolveRequest } from "@/lib/solver/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PROBLEM_CHARS = 20_000;
const MAX_ATTACHMENTS = 6;

function bad(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function parseBody(raw: unknown): SolveRequest | null {
  if (typeof raw !== "object" || raw === null) return null;
  const b = raw as Record<string, unknown>;
  const mode = b.mode === "research" ? "research" : "imo";
  const locale = b.locale === "vi" ? "vi" : "en";
  const problem = typeof b.problem === "string" ? b.problem : "";
  const attachments = Array.isArray(b.attachments)
    ? b.attachments.slice(0, MAX_ATTACHMENTS)
    : [];
  if (!problem.trim() && attachments.length === 0) return null;
  if (problem.length > MAX_PROBLEM_CHARS) return null;
  return { mode, locale, problem, attachments } as SolveRequest;
}

export async function POST(request: Request): Promise<Response> {
  // Optional access gate.
  const secret = process.env.SOLVER_ACCESS_SECRET;
  if (secret && request.headers.get("x-solver-secret") !== secret) {
    return bad("Unauthorized", 401);
  }

  let body: SolveRequest | null;
  try {
    body = parseBody(await request.json());
  } catch {
    return bad("Invalid JSON body");
  }
  if (!body) return bad("A problem (text or attachment) is required.");

  const useReal = process.env.USE_REAL_MODEL === "true";
  if (useReal && !process.env.ANTHROPIC_API_KEY) {
    return bad("Server missing ANTHROPIC_API_KEY.", 500);
  }

  const req = body;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const emit = (event: SolveEvent) => {
        if (closed) return;
        try {
          controller.enqueue(sseFrame(event));
        } catch {
          closed = true;
        }
      };
      const agentic = process.env.PIPELINE_MODE === "agentic";
      try {
        if (useReal && agentic) {
          await runAgenticStream(req, emit, request.signal);
        } else if (useReal) {
          await runClaudeStream(req, emit, request.signal);
        } else {
          await runMockStream(req, emit, request.signal);
        }
        emit({ type: "done" });
      } catch (err) {
        if (!request.signal.aborted) {
          emit({
            type: "error",
            message: err instanceof Error ? err.message : "Unknown error",
          });
        }
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
