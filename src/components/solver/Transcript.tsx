"use client";

// Claude-style transcript: the user's problem, a collapsible streamed Thinking
// panel, and the streamed solution rendered with KaTeX (reusing the ledger's
// Markdown component). Auto-scrolls while streaming.

import { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/hive-imo/Markdown";
import { SolverMarkdown } from "@/components/solver/SolverMarkdown";
import { t, type Locale } from "@/lib/imo/copy";
import type { RunState } from "@/components/solver/useSolveStream";

export function Transcript({
  run,
  locale,
}: {
  run: RunState;
  locale: Locale;
}) {
  const [showThinking, setShowThinking] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const streaming = run.status === "streaming";

  useEffect(() => {
    if (streaming) endRef.current?.scrollIntoView({ block: "end" });
  }, [run.text, run.thinking, streaming]);

  if (run.status === "idle") {
    return (
      <div className="sv-empty">
        {t(
          locale,
          "Paste or write a problem below, choose a pipeline, and the full solving process will stream here.",
          "Dán hoặc viết một bài toán bên dưới, chọn quy trình, và toàn bộ quá trình giải sẽ hiển thị tại đây.",
        )}
      </div>
    );
  }

  return (
    <div className="sv-transcript">
      {run.problem && (
        <div className="sv-msg sv-msg-user">
          <div className="sv-msg-role">{t(locale, "Problem", "Đề bài")}</div>
          <Markdown>{run.problem}</Markdown>
        </div>
      )}

      {run.thinking && (
        <div className="sv-thinking" data-open={showThinking}>
          <button
            type="button"
            className="sv-thinking-toggle"
            onClick={() => setShowThinking((v) => !v)}
          >
            {showThinking
              ? t(locale, "▾ Thinking", "▾ Suy nghĩ")
              : t(locale, "▸ Thinking", "▸ Suy nghĩ")}
          </button>
          {showThinking && <div className="sv-thinking-body">{run.thinking}</div>}
        </div>
      )}

      <div className="sv-msg sv-msg-assistant">
        <div className="sv-msg-role">
          {run.mode === "imo" ? "HIVE IMO" : "HIVE Research"}
        </div>
        {run.text ? (
          <SolverMarkdown>{run.text}</SolverMarkdown>
        ) : streaming ? (
          <div className="sv-typing" aria-live="polite">
            <span />
            <span />
            <span />
          </div>
        ) : null}
        {streaming && run.text && <span className="sv-caret" aria-hidden />}
      </div>

      {run.status === "error" && (
        <div className="sv-error" role="alert">
          {t(locale, "Error", "Lỗi")}: {run.error}
        </div>
      )}

      {run.usage && run.status !== "streaming" && (
        <div className="sv-usage">
          {run.usage.input + run.usage.output > 0
            ? t(
                locale,
                `Tokens — in ${run.usage.input.toLocaleString()}, out ${run.usage.output.toLocaleString()}`,
                `Token — vào ${run.usage.input.toLocaleString()}, ra ${run.usage.output.toLocaleString()}`,
              )
            : t(locale, "Preview mode · no tokens used", "Chế độ xem trước · không dùng token")}
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
