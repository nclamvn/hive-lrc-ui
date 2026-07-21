import type { ProblemRecord } from "@/lib/imo/ledger";
import { STAGE_NAMES, t, type Locale } from "@/lib/imo/copy";
import { ArtifactList } from "@/components/hive-imo/ArtifactList";

export function StageTimeline({ p, locale }: { p: ProblemRecord; locale: Locale }) {
  return (
    <ol className="hi-timeline">
      {p.stages.map((s) => {
        const name = STAGE_NAMES[s.id];
        const done = ["VERIFIED-INDEPENDENT", "FORMALIZED", "PUBLISHED"].includes(s.status);
        const frozen = s.status === "OFFICIAL-FROZEN" || s.status === "FROZEN-PENDING-REVIEW";
        const active = s.status !== "NOT-STARTED" && !done && !frozen;
        const cls = done ? "done" : frozen ? "frozen" : active ? "active" : "";
        const hasNotes = Boolean(s.human || s.ai || (s.artifacts && s.artifacts.length));
        return (
          <li key={s.id} className={`hi-tl ${cls}`}>
            <div className="hi-tl-top">
              <span className="hi-tl-id">{s.id}</span>
              <span className="hi-tl-name">{locale === "vi" ? name.vi : name.en}</span>
            </div>
            {hasNotes ? (
              <div className="hi-tl-roles">
                {s.human && <span><b>HUMAN</b> · {s.human}</span>}
                {s.ai && <span><b>AI</b> · {s.ai}</span>}
                {s.artifacts && s.artifacts.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <ArtifactList artifacts={s.artifacts} locale={locale} compact />
                  </div>
                )}
              </div>
            ) : (
              <div className="hi-tl-body">{t(locale, "Not started.", "Chưa bắt đầu.")}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
