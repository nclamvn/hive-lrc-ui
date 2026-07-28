"use client";

// Client hook: POSTs to /api/solve, reads the SSE stream, and reduces the
// SolveEvent protocol into render state (growing transcript + thinking +
// per-stage status). Handles Stop via AbortController.

import { useCallback, useRef, useState } from "react";
import type {
  Session,
  SolveEvent,
  SolveMode,
  SolveRequest,
  StageStatus,
  Verdict,
} from "@/lib/solver/types";

export type RunStatus = "idle" | "streaming" | "done" | "error";

export interface RunState {
  status: RunStatus;
  mode: SolveMode;
  problem: string;
  text: string;
  thinking: string;
  stages: Record<string, StageStatus>;
  activeStage: string | null;
  verdicts: Verdict[];
  usage: { input: number; output: number } | null;
  error: string | null;
}

const EMPTY: RunState = {
  status: "idle",
  mode: "imo",
  problem: "",
  text: "",
  thinking: "",
  stages: {},
  activeStage: null,
  verdicts: [],
  usage: null,
  error: null,
};

export function useSolveStream() {
  const [run, setRun] = useState<RunState>(EMPTY);
  const abortRef = useRef<AbortController | null>(null);

  const apply = useCallback((ev: SolveEvent) => {
    setRun((r) => {
      switch (ev.type) {
        case "text":
          return { ...r, text: r.text + ev.delta };
        case "thinking":
          return { ...r, thinking: r.thinking + ev.delta };
        case "stage": {
          const stages = { ...r.stages, [ev.id]: ev.status };
          return {
            ...r,
            stages,
            activeStage: ev.status === "active" ? ev.id : r.activeStage,
          };
        }
        case "verdict": {
          const i = r.verdicts.findIndex((v) => v.id === ev.verdict.id);
          const verdicts =
            i >= 0
              ? r.verdicts.map((v, j) => (j === i ? ev.verdict : v))
              : [...r.verdicts, ev.verdict];
          return { ...r, verdicts };
        }
        case "usage":
          return { ...r, usage: { input: ev.input, output: ev.output } };
        case "done":
          return { ...r, status: "done", activeStage: null };
        case "error":
          return { ...r, status: "error", error: ev.message };
        default:
          return r;
      }
    });
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setRun((r) => (r.status === "streaming" ? { ...r, status: "done" } : r));
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setRun(EMPTY);
  }, []);

  const load = useCallback((s: Session) => {
    abortRef.current?.abort();
    setRun({
      ...EMPTY,
      status: "done",
      mode: s.mode,
      problem: s.problem,
      text: s.text,
      verdicts: s.verdicts,
      usage: s.usage,
    });
  }, []);

  const start = useCallback(
    async (req: SolveRequest, secret?: string) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setRun({
        ...EMPTY,
        status: "streaming",
        mode: req.mode,
        problem: req.problem,
      });

      try {
        const res = await fetch("/api/solve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(secret ? { "x-solver-secret": secret } : {}),
          },
          body: JSON.stringify(req),
          signal: ac.signal,
        });
        if (!res.ok || !res.body) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || `Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const frames = buf.split("\n\n");
          buf = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!line) continue;
            try {
              apply(JSON.parse(line.slice(5).trim()) as SolveEvent);
            } catch {
              // ignore malformed frame
            }
          }
        }
        setRun((r) => (r.status === "streaming" ? { ...r, status: "done" } : r));
      } catch (err) {
        if (ac.signal.aborted) return;
        setRun((r) => ({
          ...r,
          status: "error",
          error: err instanceof Error ? err.message : "Stream failed",
        }));
      }
    },
    [apply],
  );

  return { run, start, stop, reset, load };
}
