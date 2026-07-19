import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { nodes, edges, type Locale } from "@/lib/observatory";
import { CuratedMap } from "@/components/observatory/CuratedMap";

export function generateStaticParams() { return [{ locale: "en" }, { locale: "vi" }]; }
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  return (
    <main className="og-page wide">
      <p className="og-page-kicker">{t(L, "Research map", "Bản đồ nghiên cứu")}</p>
      <h1 className="og-page-h1">{t(L, "The attack as a dependency graph", "Cuộc tấn công dưới dạng đồ thị phụ thuộc")}</h1>
      <p className="og-page-lede">{t(L,
        "A hand-laid map of the research: the gate timeline along the top, and below it the claim dependency chain, how each theorem supports, supersedes or reduces to the next, down to the open target LRC(13).",
        "Bản đồ nghiên cứu được sắp đặt thủ công: phía trên là trục thời gian các gate, bên dưới là chuỗi phụ thuộc giữa các mệnh đề, cho thấy mỗi định lý củng cố, thay thế hay quy về cái kế tiếp ra sao, dẫn tới mục tiêu còn bỏ ngỏ LRC(13).")}</p>
      <div style={{ marginTop: 20 }}>
        <CuratedMap nodes={nodes} edges={edges} locale={L} />
      </div>
    </main>
  );
}
