import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { claims, edges, claimById, pick, statusToken, claimStatusLabel, type Locale } from "@/lib/observatory";

export function generateStaticParams() {
  return claims.flatMap((c) => [{ locale: "en", id: c.claim_id }, { locale: "vi", id: c.claim_id }]);
}
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);
const tok = (s: string) => statusToken(s).replace("obs-", "");

export default async function ClaimDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  const c = claimById(id);
  if (!c) notFound();
  const base = `/${L}/observatory`;
  const outgoing = edges.filter((e) => e.source === id);
  const incoming = edges.filter((e) => e.target === id);

  return (
    <main className="og-page og-detail">
      <p className="og-page-kicker">{c.claim_id}</p>
      <h1 className="og-page-h1">{pick(c.statement, L)}</h1>
      <div className="og-meta-row">
        <span className={`og-chip ${tok(c.status)}`}>{pick(claimStatusLabel[c.status], L)}</span>
        <span className="og-chip">{t(L, "Evidence", "Evidence")} {c.evidence}</span>
        <span className="og-chip">{t(L, "Scope", "Phạm vi")}: {c.scope}</span>
        <span className="og-chip">{t(L, "Since", "Từ")} {c.gate_introduced}</span>
      </div>

      <h2>{t(L, "In plain language", "Nói dễ hiểu")}</h2>
      <p>{pick(c.plain_language, L)}</p>

      <h2 className="og-audit">{t(L, "Exact statement", "Phát biểu chính xác")}</h2>
      <p className="og-audit og-tech">{pick(c.statement, L)}</p>

      {c.superseded_by && <p style={{ marginTop: 16 }}>{t(L, "This claim was superseded by ", "Claim này được thay bởi ")}<Link href={`${base}/claims/${c.superseded_by}`}><strong>{c.superseded_by}</strong></Link>.</p>}
      {c.supersedes && <p style={{ marginTop: 16 }}>{t(L, "This claim supersedes ", "Claim này thay thế ")}<Link href={`${base}/claims/${c.supersedes}`}><strong>{c.supersedes}</strong></Link>.</p>}

      {(outgoing.length > 0 || incoming.length > 0) && (
        <>
          <h2>{t(L, "Dependencies", "Phụ thuộc")}</h2>
          <div className="og-deps">
            {incoming.map((e) => (
              <Link key={e.id} href={`${base}/claims/${e.source}`} className="og-dep"><span className="og-dep-rel">{e.source} {e.relation} →</span><span style={{ fontSize: 13 }}>{pick(e.explanation, L)}</span></Link>
            ))}
            {outgoing.map((e) => (
              <Link key={e.id} href={`${base}/claims/${e.target}`} className="og-dep"><span className="og-dep-rel">→ {e.relation} {e.target}</span><span style={{ fontSize: 13 }}>{pick(e.explanation, L)}</span></Link>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 34, display: "flex", gap: 10 }}>
        <Link href={`${base}/claims`} className="og-btn">← {t(L, "All claims", "Tất cả claim")}</Link>
        <Link href={`${base}/map`} className="og-btn">{t(L, "See in map", "Xem trên bản đồ")}</Link>
      </div>
    </main>
  );
}
