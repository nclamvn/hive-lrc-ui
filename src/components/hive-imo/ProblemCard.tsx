import Link from "next/link";
import type { ProblemRecord } from "@/lib/imo/ledger";
import { slugFor, STAGE_IDS } from "@/lib/imo/ledger";
import { EVIDENCE_LABELS, STAGE_NAMES, t, type Locale } from "@/lib/imo/copy";
import { StatusBadge } from "@/components/hive-imo/StatusBadge";

// Most-advanced stage that has left NOT-STARTED — the "latest gate" line.
function latestStage(p: ProblemRecord): string {
  const active = [...p.stages].reverse().find((s) => s.status !== "NOT-STARTED");
  if (!active) return "S0";
  return active.id;
}

function fmtDate(iso: string, locale: Locale): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function ProblemCard({ p, locale }: { p: ProblemRecord; locale: Locale }) {
  const ev = EVIDENCE_LABELS[p.evidence_class];
  const gate = latestStage(p);
  const gateName = STAGE_NAMES[gate as (typeof STAGE_IDS)[number]];
  const domain = p.domain.length ? p.domain.join(" · ") : t(locale, "Area not yet classified", "Chưa phân loại lĩnh vực");

  return (
    <Link className="hi-card" href={`/${locale}/hive-imo-2026/${slugFor(p)}`}>
      <div className="hi-card-top">
        <div>
          <div className="hi-card-pnum">{t(locale, "Problem", "Bài")} {p.number}</div>
          <div className="hi-card-domain">{domain}</div>
        </div>
        <StatusBadge status={p.status} locale={locale} />
      </div>

      <div className="hi-card-row">
        <span className="k">{t(locale, "Latest gate", "Gate gần nhất")}</span>
        <span className="v">{gate} · {locale === "vi" ? gateName.vi : gateName.en}</span>
      </div>
      <div className="hi-card-row">
        <span className="k">{t(locale, "Evidence", "Bằng chứng")}</span>
        <span className="v">{p.evidence_class} · {locale === "vi" ? ev.vi : ev.en}</span>
      </div>
      <div className="hi-card-row">
        <span className="k">{t(locale, "Proof candidates rejected", "Proof ứng viên bị bác")}</span>
        <span className="v">{p.proofs_rejected}</span>
      </div>
      <div className="hi-card-row">
        <span className="k">{t(locale, "Counterexamples found", "Phản ví dụ tìm được")}</span>
        <span className="v">{p.counterexamples_found}</span>
      </div>

      <div className="hi-card-foot">
        <span className="hi-card-updated">{fmtDate(p.last_updated, locale)}</span>
        <span className="hi-card-link">{t(locale, "View journey →", "Xem hành trình →")}</span>
      </div>
    </Link>
  );
}
