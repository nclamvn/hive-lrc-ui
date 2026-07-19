import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { claims, pick, statusToken, claimStatusLabel, type Locale } from "@/lib/observatory";

export function generateStaticParams() { return [{ locale: "en" }, { locale: "vi" }]; }
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);
const tok = (s: string) => statusToken(s).replace("obs-", "");

export default async function ClaimsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  const base = `/${L}/observatory`;
  const order = ["open", "validated_exact", "proved_internal", "supported_internal", "supported_conditional", "external_claim", "superseded", "refuted"];
  const sorted = [...claims].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
  return (
    <main className="og-page">
      <p className="og-page-kicker">{t(L, "Claims & evidence", "Claim & bằng chứng")}</p>
      <h1 className="og-page-h1">{t(L, "Public claim ledger", "Sổ claim công khai")}</h1>
      <p className="og-page-lede">{t(L,
        "Every statement carries an exact status, evidence class and scope. Proved, validated-by-computation and provisional are kept distinct, superseded claims are retained and linked to their successor.",
        "Mỗi phát biểu mang trạng thái, lớp evidence và phạm vi chính xác. Đã chứng minh, kiểm-bằng-tính-toán và tạm thời được giữ tách biệt, claim bị thay được giữ lại và liên kết tới cái thay thế.")}</p>
      <div className="og-grid" style={{ marginTop: 26 }}>
        {sorted.map((c) => (
          <Link key={c.claim_id} href={`${base}/claims/${c.claim_id}`} className={`og-tile ${c.status === "superseded" ? "tok-superseded" : ""}`} style={c.status === "superseded" ? { opacity: 0.72 } : undefined}>
            <div className="og-tile-top"><span className="og-tile-id">{c.claim_id}</span><span className={`og-chip ${tok(c.status)}`}>{pick(claimStatusLabel[c.status], L)}</span></div>
            <div className="og-tile-title">{pick(c.statement, L)}</div>
            <div className="og-tile-body">{pick(c.plain_language, L)}</div>
            <div className="og-tile-meta"><span>{c.scope}</span><span>· {c.evidence}</span></div>
          </Link>
        ))}
      </div>
    </main>
  );
}
