import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { releasesDesc, pick, changeTypeLabel, type Locale } from "@/lib/observatory";

export function generateStaticParams() { return [{ locale: "en" }, { locale: "vi" }]; }
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);

export default async function Journal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  const base = `/${L}/observatory`;
  const feed = releasesDesc();
  return (
    <main className="og-page">
      <p className="og-page-kicker">{t(L, "Journal", "Nhật ký")}</p>
      <h1 className="og-page-h1">{t(L, "Edited research log", "Nhật ký nghiên cứu biên tập")}</h1>
      <p className="og-page-lede">{t(L,
        "Every entry is an Owner-approved release, not a raw log tail. Corrections and withdrawals appear at parity with new theorems, that is what makes the record trustworthy.",
        "Mỗi mục là một release được Owner duyệt, không phải log thô. Sửa chữa và rút claim hiển thị ngang hàng với định lý mới, chính điều đó tạo độ tin cậy.")}</p>
      <div className="og-block" style={{ marginTop: 24 }}>
        {feed.map((r) => (
          <div className="og-feedrow" key={r.id}>
            <div className="og-feedrow-top">
              <span style={{ fontSize: 9.5, color: "var(--obs-ink-3)" }}>#{r.sequence} · {r.id}</span>
              <span className="og-chip" style={{ fontSize: 8.5, padding: "1px 7px" }}>{pick(changeTypeLabel[r.change_type], L)}</span>
              <Link href={`${base}/gates/${r.gate_id}`} style={{ fontSize: 10, color: "var(--obs-ink-3)", marginLeft: "auto", textDecoration: "none" }}>{r.gate_id}</Link>
            </div>
            <div className="og-feedrow-title">{pick(r.title, L)}</div>
            <div className="og-feedrow-body">{pick(r.summary_public, L)}</div>
            <div className="og-audit og-feedrow-body" style={{ fontFamily: "ui-monospace, Menlo, monospace", color: "var(--obs-ink-3)", marginTop: 5 }}>{pick(r.summary_technical, L)}</div>
            <div className="og-tile-meta"><span>{t(L, "scope", "phạm vi")}: {r.scope}</span><span>· {r.evidence}</span>{r.supersedes_release_id && <span>· {t(L, "supersedes", "thay")} {r.supersedes_release_id}</span>}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
