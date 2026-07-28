// Shared contract between the /api/solve route and the client solver UI.
// The mock path and the real Claude path emit the SAME event union, so the UI
// is identical in either mode (USE_REAL_MODEL flag on the server).

export type SolveMode = "imo" | "research";

export type StageStatus = "pending" | "active" | "done";

// A single rail stop. For IMO these are S0..S14 (STAGE_NAMES in imo/copy.ts);
// for Research these are the Gate/Route phases defined in prompts.ts.
export interface StageDef {
  id: string; // e.g. "S2" or "R3"
  en: string;
  vi: string;
}

// An attachment the user sends with the problem (image or PDF), base64-encoded.
export interface SolveAttachment {
  kind: "image" | "pdf";
  mediaType: string; // e.g. "image/png", "application/pdf"
  dataBase64: string; // raw base64, no data: prefix
  name?: string;
}

// Request body POSTed to /api/solve.
export interface SolveRequest {
  mode: SolveMode;
  locale: "en" | "vi";
  problem: string;
  attachments?: SolveAttachment[];
}

export type VerdictStatus = "checking" | "verified" | "refuted" | "unverified";

// A fresh-context verifier's judgement on a claim/lemma produced upstream.
export interface Verdict {
  id: string;
  claim: string;
  status: VerdictStatus;
  note?: string;
  stage?: string;
}

// Server -> client SSE events. Each is sent as one `data: <json>\n\n` frame.
export type SolveEvent =
  | { type: "stage"; id: string; status: StageStatus }
  | { type: "thinking"; delta: string }
  | { type: "text"; delta: string }
  | { type: "verdict"; verdict: Verdict }
  | { type: "usage"; input: number; output: number }
  | { type: "done" }
  | { type: "error"; message: string };

// A saved solve, persisted client-side (localStorage) for the history panel.
export interface Session {
  id: string;
  createdAt: number;
  mode: SolveMode;
  locale: "en" | "vi";
  problem: string;
  text: string;
  verdicts: Verdict[];
  usage: { input: number; output: number } | null;
}
