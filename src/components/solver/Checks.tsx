"use client";

// Verification ledger: fresh-context verifier verdicts on the claims/lemmas
// produced during the solve. Populated by `verdict` SSE events (agentic real
// path, or the mock demo).

import { t, type Locale } from "@/lib/imo/copy";
import type { Verdict } from "@/lib/solver/types";

const CHIP: Record<Verdict["status"], { en: string; vi: string }> = {
  checking: { en: "checking…", vi: "đang kiểm…" },
  verified: { en: "verified", vi: "đã kiểm chứng" },
  refuted: { en: "refuted", vi: "bác bỏ" },
  unverified: { en: "unverified", vi: "chưa kiểm chứng" },
};

export function Checks({
  verdicts,
  locale,
}: {
  verdicts: Verdict[];
  locale: Locale;
}) {
  if (verdicts.length === 0) return null;
  return (
    <section className="sv-checks" aria-label={t(locale, "Verification", "Kiểm chứng")}>
      <div className="sv-checks-title">{t(locale, "Verification", "Kiểm chứng")}</div>
      <ul className="sv-checks-list">
        {verdicts.map((v) => (
          <li key={v.id} className="sv-check" data-status={v.status}>
            <span className="sv-check-chip">{t(locale, CHIP[v.status].en, CHIP[v.status].vi)}</span>
            <span className="sv-check-claim">{v.claim}</span>
            {v.note && <span className="sv-check-note">{v.note}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
