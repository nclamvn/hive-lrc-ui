import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { gates, pick, statusToken, type Locale } from "@/lib/observatory";

export function generateStaticParams() { return [{ locale: "en" }, { locale: "vi" }]; }
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);
const tok = (s: string) => statusToken(s).replace("obs-", "");

export default async function GatesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  const base = `/${L}/observatory`;
  return (
    <main className="og-page">
      <p className="og-page-kicker">{t(L, "Gates", "Gate")}</p>
      <h1 className="og-page-h1">{t(L, "Research gates, D0 → D26", "Các gate nghiên cứu, D0 → D26")}</h1>
      <p className="og-page-lede">{t(L,
        "Each gate is a reviewed step: exact mathematics, two independent verifiers, and a corruption suite. Status is honest, partial and blocked gates are shown as such.",
        "Mỗi gate là một bước đã được rà soát: toán học chính xác, hai bộ kiểm chứng độc lập, và một bộ kiểm thử tấn công. Trạng thái được ghi trung thực; các gate đạt một phần hay bị chặn đều hiển thị đúng như vậy.")}</p>
      <div className="og-grid" style={{ marginTop: 26 }}>
        {gates.map((g) => (
          <Link key={g.id} href={`${base}/gates/${g.id}`} className="og-tile">
            <div className="og-tile-top"><span className="og-tile-id">{g.phase}</span><span className={`og-chip ${tok(g.status)}`}>{g.status}</span></div>
            <div className="og-tile-title serif">{pick(g.title, L)}</div>
            <div className="og-tile-body">{pick(g.summary, L).slice(0, 138)}…</div>
            <div className="og-tile-meta"><span>{g.date}</span><span>· {g.independence}</span><span>· {g.artifacts} {t(L, "artifacts", "artifact")}</span></div>
          </Link>
        ))}
      </div>
    </main>
  );
}
