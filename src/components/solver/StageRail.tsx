"use client";

// Vertical pipeline rail. Each stop is pending / active (animated) / done,
// driven by `stage` SSE events. Stage labels come from prompts.ts (which for
// IMO reuse the canonical S0..S14 ledger names).

import type { StageDef, StageStatus } from "@/lib/solver/types";
import { t, type Locale } from "@/lib/imo/copy";

export function StageRail({
  stages,
  status,
  locale,
}: {
  stages: StageDef[];
  status: Record<string, StageStatus>;
  locale: Locale;
}) {
  return (
    <aside className="sv-rail" aria-label={t(locale, "Pipeline", "Quy trình")}>
      <div className="sv-rail-title">
        {t(locale, "Pipeline", "Quy trình")}
      </div>
      <ol className="sv-rail-list">
        {stages.map((s) => {
          const st: StageStatus = status[s.id] ?? "pending";
          return (
            <li key={s.id} className="sv-rail-item" data-status={st}>
              <span className="sv-rail-dot" aria-hidden />
              <span className="sv-rail-id">{s.id}</span>
              <span className="sv-rail-label">{t(locale, s.en, s.vi)}</span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
