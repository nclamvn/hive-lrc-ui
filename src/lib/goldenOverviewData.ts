/**
 * View-model for the golden overview home. LIVE (from the published snapshot) by default; the static
 * pixel fixture only in golden mode (?fixture=golden) so the Contractor pixel-test layout is preserved.
 */
import { gates, releasesDesc, claims, pick, changeTypeLabel, type Locale } from "@/lib/observatory";
import fixture from "@/data/observatory-golden/fixture.json";

export interface GoldenVM {
  hero: { eyebrow: string; title: string; subtitle: string };
  problem: {
    kicker: string; title: string; lede: string; impact: string;
    milestones: { year: string; label: string; note?: string }[];
    caption: string;
  };
  latest: {
    kicker: string; phase: string; title: string; statusLabel: string; status: string;
    plain: string; stats: { value: string; label: string }[]; href: string; cta: string;
  };
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

  // latest result: derived from the current gate + its most decisive claim (auto-advances)
  const gateClaims = claims.filter((c) => c.gate_introduced === current.id);
  const summaryClaim = gateClaims[gateClaims.length - 1];
  const statusText: Record<string, string> = {
    pass: t("PASS", "ĐẠT"), partial: t("PARTIAL", "MỘT PHẦN"), blocked: t("BLOCKED", "BỊ CHẶN"),
    current: t("IN PROGRESS", "ĐANG CHẠY"), refuted: t("REFUTED", "BÁC BỎ"),
  };

  return {
    hero: {
      eyebrow: t("LIVE OBSERVATORY", "OBSERVATORY TRỰC TIẾP"),
      title: t("A live observatory of a Human-AI attack\non the Lonely Runner Conjecture.",
               "Bảng quan sát trực tiếp cuộc tấn công của AI\nvào Giả thuyết Người chạy cô đơn."),
      subtitle: t("Not a solution, a research program. Follow each theorem, computational check, correction and dead end, with exact scope and evidence at every step.",
                  "Một chương trình kiểm tra khả năng phối hợp giữa Người và AI. Theo dõi từng định lý, kiểm tra tính toán, sửa chữa và ngõ cụt, với phạm vi và evidence chính xác ở mỗi bước."),
    },
    problem: {
      kicker: t("THE LONELY RUNNER CONJECTURE", "GIẢ THUYẾT NGƯỜI CHẠY CÔ ĐƠN"),
      title: t("The problem", "Bài toán"),
      lede: t("Picture runners on a circular track, starting together at distinct constant speeds. The conjecture says each runner is, at some moment, lonely: at least 1/n of the lap from every other runner. Simple to state, and still unproven beyond 7 runners.",
              "Hình dung những người chạy trên một đường tròn, xuất phát cùng lúc với các vận tốc khác nhau và không đổi. Giả thuyết nói rằng mỗi người, tại một thời điểm nào đó, sẽ cô đơn: cách mọi người khác ít nhất 1/n vòng chạy. Dễ phát biểu, nhưng tới nay vẫn chưa ai chứng minh được vượt quá 7 người chạy."),
      impact: t("Its ideas reach into view-obstruction geometry, Diophantine approximation, and the flows and colourings of graphs.",
                "Các ý tưởng của nó lan tới hình học che khuất tầm nhìn, xấp xỉ Diophantine, và các luồng cùng cách tô màu trên đồ thị."),
      caption: t("LRC(3): 3 speeds, 4 runners, lonely distance 1/4", "LRC(3): 3 vận tốc, 4 người chạy, khoảng cô đơn 1/4"),
      milestones: [
        { year: "1967", label: t("Posed", "Được đặt ra"), note: t("J. M. Wills, Diophantine approximation", "J. M. Wills, xấp xỉ Diophantine") },
        { year: "1970s", label: t("View-obstruction form", "Dạng che khuất tầm nhìn"), note: t("T. W. Cusick", "T. W. Cusick") },
        { year: "1998", label: t("Named the Lonely Runner", "Được đặt tên Người chạy cô đơn"), note: t("L. Goddyn", "L. Goddyn") },
        { year: "2008", label: t("Proved for up to 7 runners", "Chứng minh tới 7 người chạy"), note: t("Barajas-Serra; smaller cases earlier", "Barajas-Serra; các trường hợp nhỏ hơn trước đó") },
        { year: t("Now", "Nay"), label: t("This project: LRC(13)", "Dự án này: LRC(13)"), note: t("14 runners, beyond the proved range, OPEN", "14 người chạy, vượt ngưỡng đã chứng minh, còn MỞ") },
      ],
    },
    latest: {
      kicker: t("LATEST RESULT", "KẾT QUẢ MỚI NHẤT"),
      phase: current.phase,
      title: pick(current.title, locale),
      status: current.status,
      statusLabel: statusText[current.status] ?? current.status,
      plain: summaryClaim ? pick(summaryClaim.plain_language, locale) : pick(current.summary, locale),
      stats: [
        { value: current.independence, label: t("evidence", "bằng chứng") },
        { value: current.verify === "double" ? "2×" : current.verify === "single" ? "1×" : "—", label: t("verifiers", "verifier") },
        { value: String(current.artifacts), label: t("artifacts", "artifact") },
      ],
      href: `/${locale}/observatory/gates`,
      cta: t("Read the gate →", "Xem chi tiết gate →"),
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
