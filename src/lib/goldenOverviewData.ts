/**
 * View-model for the golden overview home. LIVE (from the published snapshot) by default; the static
 * pixel fixture only in golden mode (?fixture=golden) so the Contractor pixel-test layout is preserved.
 */
import { gates, releasesDesc, claims, pick, changeTypeLabel, type Locale } from "@/lib/observatory";
import fixture from "@/data/observatory-golden/fixture.json";

export interface GoldenVM {
  hero: { eyebrow: string; title: string; subtitle: string };
  metrics: { label: string; value: string; description: string; status: string; icon: string; accent?: boolean; badge?: string }[];
  feed: { time: string; seq: string; type: string; title: string; body: string }[];
  graph: typeof fixture.graph;
}

export function buildGoldenVM(locale: Locale, golden: boolean): GoldenVM {
  // golden pixel mode: return the frozen fixture verbatim (EN, deterministic)
  if (golden) return fixture as unknown as GoldenVM;

  const t = (en: string, vi: string) => (locale === "vi" ? vi : en);
  const current = gates[gates.length - 1];
  const feed = releasesDesc().slice(0, 5).map((r) => ({
    time: "", seq: `#${r.sequence}`, type: pick(changeTypeLabel[r.change_type], locale).toUpperCase(),
    title: pick(r.title, locale), body: pick(r.summary_public, locale),
  }));

  return {
    hero: {
      eyebrow: t("LIVE OBSERVATORY", "OBSERVATORY TRỰC TIẾP"),
      title: t("A live observatory of a Human-AI attack\non the Lonely Runner Conjecture.",
               "Bảng quan sát trực tiếp cuộc tấn công của AI\nvào Giả thuyết Người chạy cô đơn."),
      subtitle: t("Not a solution, a research program. Follow each theorem, computational check, correction and dead end, with exact scope and evidence at every step.",
                  "Một chương trình kiểm tra khả năng phối hợp giữa Người và AI. Theo dõi từng định lý, kiểm tra tính toán, sửa chữa và ngõ cụt, với phạm vi và evidence chính xác ở mỗi bước."),
    },
    metrics: [
      { label: t("TARGET CLAIM", "MỤC TIÊU"), value: "LRC(13)", description: t("Lonely Runner Conjecture", "Giả thuyết Người chạy cô đơn"),
        status: t("Open", "Đang mở"), icon: "crosshair" },
      { label: t("CURRENT RESEARCH GATE", "GATE HIỆN TẠI"), value: current.phase, description: pick(current.title, locale),
        status: current.status === "current" ? t("In progress", "Đang chạy") : current.status, icon: "sparkles", accent: true },
      { label: t("HIGHEST INDEPENDENT REPRODUCTION", "TÁI LẬP ĐỘC LẬP CAO NHẤT"), value: "k = 9", badge: t("Verified", "Đã kiểm"),
        description: t("Matched upstream exactly", "Khớp thượng nguồn"), status: "I1", icon: "shield-check" },
      { label: t("LATEST STRUCTURAL ADVANCE", "TIẾN BỘ CẤU TRÚC MỚI NHẤT"), value: t("Support-4 complete", "Support-4 đầy đủ"),
        description: t("Inventory over all 109 primes", "Đầy đủ trên toàn 109 prime"), status: t("τ4 < 8/1000", "τ4 < 8/1000"), icon: "boxes", accent: true },
    ],
    feed,
    graph: fixture.graph, // curated locked-coordinate preview diagram (full interactive graph on /observatory/map)
  };
}
