import { Check, CheckCheck, Circle, Dot } from "lucide-react";
import type { Locale } from "@/i18n";
import { gates, verifyMeta, type Milestone } from "@/data/wiki/gates";

const STATUS_LABEL: Record<Milestone["status"], { en: string; vi: string }> = {
  pass: { en: "PASS", vi: "ĐẠT" },
  partial: { en: "PARTIAL", vi: "MỘT PHẦN" },
  blocked: { en: "BLOCKED", vi: "CHẶN" },
  current: { en: "CURRENT", vi: "HIỆN TẠI" },
};

function VerifyBadge({ level, locale }: { level: Milestone["verify"]; locale: Locale }) {
  const meta = verifyMeta[level];
  const label = locale === "vi" ? meta.vi : meta.en;
  const Icon = level === "double" ? CheckCheck : level === "single" ? Check : Circle;
  return (
    <span className={`verify-badge verify-${level}`} title={label}>
      <Icon className="verify-icon" strokeWidth={2} aria-hidden="true" />
      {label}
    </span>
  );
}

export function MilestoneTimeline({ locale }: { locale: Locale }) {
  const tx = (o: { en: string; vi: string }) => (locale === "vi" ? o.vi : o.en);
  return (
    <ol className="timeline" aria-label="Milestones">
      {gates.map((g, i) => (
        <li key={g.id} className={`timeline-item is-${g.status}`}>
          <span className="timeline-rail" aria-hidden="true">
            <span className="timeline-node">
              {g.status === "current" ? <Dot className="timeline-node-dot" strokeWidth={3} /> : null}
            </span>
            {i < gates.length - 1 && <span className="timeline-line" />}
          </span>
          <div className="timeline-body">
            <div className="timeline-head">
              <span className="timeline-phase">{g.phase}</span>
              <span className={`pill pill-milestone pill-${g.status}`}>{tx(STATUS_LABEL[g.status])}</span>
              <VerifyBadge level={g.verify} locale={locale} />
              <span className="timeline-ind">{g.independence}</span>
              <span className="timeline-date">{g.date}</span>
            </div>
            <h3 className="timeline-title">{tx(g.title)}</h3>
            <p className="timeline-summary">{tx(g.summary)}</p>
            <ul className="timeline-checks">
              {g.checks.map((c, j) => (
                <li key={j}>
                  <CheckCheck className="check-tick" strokeWidth={2} aria-hidden="true" />
                  {tx(c)}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
