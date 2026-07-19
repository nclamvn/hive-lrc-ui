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
    statusLine: string; plain: string; stats: { value: string; label: string }[]; href: string; cta: string;
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

  // latest result: phase/status/stats derived from the current gate (auto-advances);
  // the explanation is a curated, fuller plain-language summary of the current result.
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
      lede: t("Picture runners on a circular track, starting together at distinct constant speeds. The conjecture says each runner is, at some moment, lonely: at least $1/n$ of the lap from every other runner. Simple to state, its general case is still unproven beyond 7 runners.",
              "Hình dung những người chạy trên một đường tròn, xuất phát cùng lúc với các vận tốc khác nhau và không đổi. Giả thuyết nói rằng mỗi người, tại một thời điểm nào đó, sẽ cô đơn: cách mọi người khác ít nhất $1/n$ vòng chạy. Dễ phát biểu, nhưng trường hợp tổng quát tới nay vẫn chưa được chứng minh vượt quá 7 người chạy."),
      impact: t("A general proof and a computational check are different things. The conjecture is settled for every speed configuration up to 7 runners, while specific integer-speed instances have been verified by computation much further, up to the 12-speed case upstream. This project independently reproduced the 9-speed instance and now targets the 13-speed instance ($14$ runners); the general case there remains open. The conjecture also connects to view-obstruction geometry, Diophantine approximation, and the flows and colourings of graphs.",
                "Chứng minh tổng quát và kiểm bằng tính toán là hai việc khác nhau. Giả thuyết đã được giải cho mọi cấu hình vận tốc tới 7 người chạy, trong khi các trường hợp vận tốc nguyên cụ thể đã được kiểm bằng tính toán xa hơn nhiều, tới trường hợp 12 vận tốc ở thượng nguồn. Dự án này đã tự tái lập trường hợp 9 vận tốc và hiện nhắm tới trường hợp 13 vận tốc ($14$ người chạy); trường hợp tổng quát ở đó vẫn còn mở. Giả thuyết cũng nối với hình học che khuất tầm nhìn, xấp xỉ Diophantine, và các luồng cùng cách tô màu trên đồ thị."),
      caption: t("LRC(3): 3 speeds, 4 runners, lonely distance 1/4", "LRC(3): 3 vận tốc, 4 người chạy, khoảng cô đơn 1/4"),
      milestones: [
        { year: "1967", label: t("Posed", "Được đặt ra"), note: t("J. M. Wills, Diophantine approximation", "J. M. Wills, xấp xỉ Diophantine") },
        { year: "1970s", label: t("View-obstruction form", "Dạng che khuất tầm nhìn"), note: t("T. W. Cusick", "T. W. Cusick") },
        { year: "1998", label: t("Named the Lonely Runner", "Được đặt tên Người chạy cô đơn"), note: t("L. Goddyn", "L. Goddyn") },
        { year: "2008", label: t("General theorem: up to 7 runners", "Định lý tổng quát: tới 7 người chạy"), note: t("Barajas-Serra; open in general for 8 or more runners", "Barajas-Serra; tổng quát còn mở với từ 8 người chạy") },
        { year: t("compute", "tính toán"), label: t("Instances verified further", "Kiểm thêm nhiều trường hợp"), note: t("specific integer-speed cases up to the 12-speed instance upstream; this project reproduced the 9-speed instance", "các trường hợp vận tốc nguyên cụ thể tới 12 vận tốc ở thượng nguồn; dự án này tái lập trường hợp 9 vận tốc") },
        { year: t("Now", "Nay"), label: t("This project: LRC(13)", "Dự án này: LRC(13)"), note: t("the 13-speed instance, 14 runners, general case OPEN", "trường hợp 13 vận tốc, 14 người chạy, tổng quát còn MỞ") },
      ],
    },
    latest: {
      kicker: t("LATEST RESULT", "KẾT QUẢ MỚI NHẤT"),
      phase: current.phase,
      title: t("Direct coordinate CRT: threshold halving with a labeling obstruction",
               "Tái dựng CRT trực tiếp theo nghiệm: giảm một nửa ngưỡng, chưa vượt chi phí ghép nhãn"),
      status: current.status,
      statusLabel: statusText[current.status] ?? current.status,
      statusLine: "Direct-coordinate CRT: PROVED-INTERNAL · Campaign fit: NEGATIVE under frozen caps · V1/V2 ACCEPT · corruption suite PASS · LRC(13) OPEN",
      plain: t(
        "D26 proves that a globally ordered, positive, primitive tuple of $13$ speeds can be reconstructed directly, coordinate by coordinate, using CRT. The reconstruction threshold drops from roughly $1946$ bits for the symmetric-coefficient route to roughly $969$ bits, reducing the required accumulated primes from about $205$ to about $109$ (a factor of about $2.008$). The local cover at each prime, however, is an unordered multiset. Expanding every assignment onto the $13$ global labels yields a worst-case branching proxy near $(13!)^{109}$, which cancels the lower-threshold benefit under the current frozen resource caps. The two reconstruction theorems stand; the full labeled campaign does not close. LRC(13) remains OPEN.",
        "D26 chứng minh rằng một bộ $13$ vận tốc dương, nguyên thủy và được sắp thứ tự toàn cục có thể được tái dựng trực tiếp theo từng tọa độ bằng CRT. Ngưỡng tái dựng giảm từ khoảng $1946$ bits của phương pháp hệ số đối xứng xuống khoảng $969$ bits, tương ứng giảm số prime cần tích lũy từ khoảng $205$ xuống $109$ (hệ số khoảng $2.008$). Tuy nhiên, local cover tại mỗi prime là một multiset không thứ tự. Việc bung toàn bộ phép ghép vào $13$ nhãn toàn cục tạo worst-case branching proxy gần $(13!)^{109}$, làm mất lợi ích của ngưỡng thấp hơn dưới giới hạn tài nguyên hiện tại. Hai định lý tái dựng vẫn được giữ nguyên; full labeled campaign chưa đóng. LRC(13) vẫn đang mở."),
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
