import type { ContributionLevel, ProblemRecord } from "@/lib/imo/ledger";
import { CONTRIBUTION_LABELS, MATRIX_COLS, MATRIX_ROWS, t, type Locale } from "@/lib/imo/copy";

function cellClass(level: ContributionLevel | undefined): string {
  if (level === "LEAD" || level === "CO-LEAD") return "lead";
  if (level === "VERIFY") return "verify";
  return "";
}

export function ContributionMatrix({ p, locale }: { p: ProblemRecord; locale: Locale }) {
  const contrib = p.contributions ?? {};
  const anyData = Object.keys(contrib).length > 0;

  return (
    <>
      <div className="hi-matrix-wrap">
      <table className="hi-matrix">
        <thead>
          <tr>
            <th>{t(locale, "Contribution", "Hạng mục")}</th>
            {MATRIX_COLS.map((c) => (
              <th key={c.key} style={{ textAlign: "center" }}>{locale === "vi" ? c.vi : c.en}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATRIX_ROWS.map((row) => {
            const cells = contrib[row.key] ?? {};
            return (
              <tr key={row.key}>
                <th scope="row">{locale === "vi" ? row.vi : row.en}</th>
                {MATRIX_COLS.map((c) => {
                  const level = cells[c.key];
                  const lbl = level ? CONTRIBUTION_LABELS[level] : CONTRIBUTION_LABELS.NONE;
                  return (
                    <td key={c.key} className={cellClass(level)}>
                      {locale === "vi" ? lbl.vi : lbl.en}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!anyData && (
        <div style={{ padding: "12px 14px", fontSize: 12.5, color: "var(--hi-faint)", borderTop: "1px solid var(--hi-border-soft)" }}>
          {t(locale,
            "Contribution attribution is recorded stage by stage; no roles are assigned until work begins.",
            "Đóng góp được ghi theo từng bước; chưa gán vai trò nào cho tới khi bắt đầu.")}
        </div>
      )}
      </div>
      <p className="hi-matrix-scroll-hint">{t(locale, "Swipe horizontally to see all columns →", "Vuốt ngang để xem đầy đủ các cột →")}</p>
    </>
  );
}
