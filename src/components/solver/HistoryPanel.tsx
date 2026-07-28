"use client";

// Saved-solve history, loaded from localStorage. Click to restore a past solve
// into the transcript; delete removes it.

import { t, type Locale } from "@/lib/imo/copy";
import type { Session } from "@/lib/solver/types";

export function HistoryPanel({
  sessions,
  locale,
  onOpen,
  onDelete,
}: {
  sessions: Session[];
  locale: Locale;
  onOpen: (s: Session) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="sv-history" aria-label={t(locale, "History", "Lịch sử")}>
      <div className="sv-history-title">{t(locale, "History", "Lịch sử")}</div>
      {sessions.length === 0 ? (
        <p className="sv-history-empty">
          {t(locale, "No saved solves yet.", "Chưa có lời giải đã lưu.")}
        </p>
      ) : (
        <ul className="sv-history-list">
          {sessions.map((s) => (
            <li key={s.id} className="sv-history-item">
              <button
                type="button"
                className="sv-history-open"
                onClick={() => onOpen(s)}
                title={s.problem}
              >
                <span className="sv-history-mode">
                  {s.mode === "imo" ? "IMO" : "RES"}
                </span>
                <span className="sv-history-text">
                  {s.problem.replace(/\$/g, "").slice(0, 46) ||
                    t(locale, "(untitled)", "(không tên)")}
                </span>
              </button>
              <button
                type="button"
                className="sv-history-del"
                aria-label={t(locale, "Delete", "Xóa")}
                onClick={() => onDelete(s.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
