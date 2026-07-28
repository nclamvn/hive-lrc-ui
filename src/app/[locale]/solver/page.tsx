"use client";

import { use, useEffect, useRef, useState } from "react";
import { Composer, type ComposerPayload } from "@/components/solver/Composer";
import { Transcript } from "@/components/solver/Transcript";
import { StageRail } from "@/components/solver/StageRail";
import { Checks } from "@/components/solver/Checks";
import { ExportBar } from "@/components/solver/ExportBar";
import { HistoryPanel } from "@/components/solver/HistoryPanel";
import { useSolveStream } from "@/components/solver/useSolveStream";
import { stagesFor } from "@/lib/solver/prompts";
import {
  deleteSession,
  listSessions,
  saveSession,
} from "@/lib/solver/sessionStore";
import { t, type Locale } from "@/lib/imo/copy";
import type { Session } from "@/lib/solver/types";

export default function SolverPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const L = (locale === "vi" ? "vi" : "en") as Locale;
  const { run, start, stop, reset, load } = useSolveStream();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const freshRef = useRef(false); // true while a user-initiated solve is running

  useEffect(() => {
    setSessions(listSessions());
  }, []);

  // Auto-save a completed, user-initiated solve (not a restored one).
  useEffect(() => {
    if (run.status === "done" && freshRef.current && run.text.trim()) {
      freshRef.current = false;
      const s: Session = {
        id: `s-${Date.now()}`,
        createdAt: Date.now(),
        mode: run.mode,
        locale: L,
        problem: run.problem,
        text: run.text,
        verdicts: run.verdicts,
        usage: run.usage,
      };
      setSessions(saveSession(s));
    }
  }, [run.status, run.text, run.mode, run.problem, run.verdicts, run.usage, L]);

  const onSubmit = (p: ComposerPayload) => {
    freshRef.current = true;
    start(
      { mode: p.mode, locale: L, problem: p.problem, attachments: p.attachments },
      p.secret || undefined,
    );
  };

  const onOpen = (s: Session) => {
    freshRef.current = false;
    load(s);
    setShowHistory(false);
  };

  const stages = stagesFor(run.status === "idle" ? "imo" : run.mode);
  const canExport = run.status === "done" && run.text.trim().length > 0;

  return (
    <div className="hi-wrap sv-page">
      <header className="sv-head">
        <div>
          <h1 className="sv-title">{t(L, "Solver", "Giải toán")}</h1>
          <p className="sv-sub">
            {t(
              L,
              "Write, paste, or upload a math problem. The full solving process streams through the HIVE pipeline, with LaTeX.",
              "Viết, dán, hoặc tải lên một bài toán. Toàn bộ quá trình giải hiển thị theo quy trình HIVE, có LaTeX.",
            )}
          </p>
        </div>
        <div className="sv-head-actions">
          <button
            type="button"
            className="sv-link-btn"
            onClick={() => setShowHistory((v) => !v)}
          >
            {t(L, "History", "Lịch sử")}
            {sessions.length > 0 ? ` (${sessions.length})` : ""}
          </button>
          {run.status !== "idle" && (
            <button type="button" className="sv-link-btn" onClick={reset}>
              {t(L, "New problem", "Bài mới")}
            </button>
          )}
        </div>
      </header>

      <div className="sv-grid">
        <div className="sv-main">
          <Transcript run={run} locale={L} />
          {canExport && <ExportBar run={run} locale={L} />}
          <Composer
            locale={L}
            streaming={run.status === "streaming"}
            onSubmit={onSubmit}
            onStop={stop}
          />
        </div>
        <div className="sv-side">
          {showHistory && (
            <HistoryPanel
              sessions={sessions}
              locale={L}
              onOpen={onOpen}
              onDelete={(id) => setSessions(deleteSession(id))}
            />
          )}
          <Checks verdicts={run.verdicts} locale={L} />
          <StageRail stages={stages} status={run.stages} locale={L} />
        </div>
      </div>
    </div>
  );
}
