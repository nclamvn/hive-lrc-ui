import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { gates, claims, gateById, pick, statusToken, claimStatusLabel, type Locale } from "@/lib/observatory";

export function generateStaticParams() {
  return gates.flatMap((g) => [{ locale: "en", id: g.id }, { locale: "vi", id: g.id }]);
}
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);
const tok = (s: string) => statusToken(s).replace("obs-", "");

export default async function GateDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  const g = gateById(id);
  if (!g) notFound();
  const base = `/${L}/observatory`;
  const introduced = claims.filter((c) => c.gate_introduced === id);
  const changed = claims.filter((c) => c.gate_last_changed === id && c.gate_introduced !== id);

  return (
    <main className="og-page og-detail">
      <p className="og-page-kicker">{g.phase}</p>
      <h1 className="og-page-h1">{pick(g.title, L)}</h1>
      <div className="og-meta-row">
        <span className={`og-chip ${tok(g.status)}`}>{g.status}</span>
        <span className="og-chip">{t(L, "Evidence", "Evidence")} {g.independence}</span>
        <span className="og-chip">{t(L, "Verify", "Kiểm")}: {g.verify}</span>
        <span className="og-chip">{t(L, "Public claim", "Claim công khai")}: {t(L, "No", "Không")}</span>
        <span className="og-chip">{g.date}</span>
      </div>

      <h2>{t(L, "What changed", "Điều gì thay đổi")}</h2>
      <p>{pick(g.summary, L)}</p>

      <h2>{t(L, "Evidence", "Bằng chứng")}</h2>
      <div className="og-deps">
        {g.checks.map((c, i) => (
          <div className="og-dep" key={i}><span className="og-dep-rel">{t(L, "check", "kiểm")} {i + 1}</span><span style={{ fontSize: 13.5 }}>{pick(c, L)}</span></div>
        ))}
      </div>
      <p className="og-audit og-tech" style={{ marginTop: 14 }}>{t(L, "Verification", "Kiểm chứng")}: {g.verify} · {g.independence} · {g.artifacts} {t(L, "artifacts (reports, verifiers, corruption suites, manifest with SHA-256)", "artifact (report, verifier, bộ tấn công, manifest SHA-256)")}</p>

      {(introduced.length > 0 || changed.length > 0) && (
        <>
          <h2>{t(L, "Graph impact", "Tác động đồ thị")}</h2>
          <div className="og-deps">
            {introduced.map((c) => (
              <Link key={c.claim_id} href={`${base}/claims/${c.claim_id}`} className="og-dep">
                <span className="og-dep-rel">{t(L, "introduced", "xuất hiện")}</span><span className="og-tile-id">{c.claim_id}</span>
                <span className={`og-chip ${tok(c.status)}`}>{pick(claimStatusLabel[c.status], L)}</span>
              </Link>
            ))}
            {changed.map((c) => (
              <Link key={c.claim_id} href={`${base}/claims/${c.claim_id}`} className="og-dep">
                <span className="og-dep-rel">{t(L, "changed", "thay đổi")}</span><span className="og-tile-id">{c.claim_id}</span>
                <span className={`og-chip ${tok(c.status)}`}>{pick(claimStatusLabel[c.status], L)}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 34 }}><Link href={`${base}/gates`} className="og-btn">← {t(L, "All gates", "Tất cả gate")}</Link></div>
    </main>
  );
}
