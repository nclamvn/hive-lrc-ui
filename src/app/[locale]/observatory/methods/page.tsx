import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { type Locale } from "@/lib/observatory";

export function generateStaticParams() { return [{ locale: "en" }, { locale: "vi" }]; }
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);

const evolution: { m: string; stop: [string, string] }[] = [
  { m: "Enumeration", stop: ["exact but exponential", "chính xác nhưng bùng nổ"] },
  { m: "Certificates", stop: ["checkable, not compressive", "kiểm được nhưng không nén"] },
  { m: "CRT witness", stop: ["prime-independent witness formula", "công thức nhân chứng độc lập prime"] },
  { m: "Fourier mass", stop: ["absolute tail too weak, signs matter", "đuôi tuyệt đối quá yếu, dấu mới quan trọng"] },
  { m: "Punctured moments", stop: ["removed the universal t=0 spike", "bỏ spike t=0 phổ quát"] },
  { m: "Ratio graph", stop: ["pairs only, rank 8 not 12", "chỉ cặp, hạng 8 không 12"] },
  { m: "Relation hypergraph", stop: ["support-3 completed the rank", "support-3 hoàn thiện hạng"] },
  { m: "Projective directions", stop: ["scalar copies collapsed to one direction", "bản sao vô hướng gom về một hướng"] },
  { m: "Modular rank (F_p)", stop: ["dimension counted mod p", "chiều đếm theo mod p"] },
  { m: "Cyclic correlation", stop: ["support-4 exact over 109 primes", "support-4 chính xác toàn 109 prime"] },
];
const ladder = [["Observation", "Quan sát"], ["Measured", "Đo được"], ["Validated (bounded)", "Thẩm định (có chặn)"], ["Supported internal · I2", "Có cơ sở nội bộ · I2"], ["Independent audit · I3", "Audit độc lập · I3"], ["Formal verification", "Kiểm chứng hình thức"]];
const lens = [{ n: "14^13", cap: ["raw tight states", "trạng thái tight thô"], w: 100, soft: false }, { n: "16,171", cap: ["orbit classes (exact)", "lớp orbit (chính xác)"], w: 42, soft: false }, { n: "p = 191", cap: ["all closed at one prime", "đóng hết tại một prime"], w: 22, soft: true }, { n: "p > 182", cap: ["uniform transfer, all primes", "chuyển đều, mọi prime"], w: 12, soft: true }];

export default async function Methods({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  return (
    <main className="og-page">
      <p className="og-page-kicker">{t(L, "Methods", "Phương pháp")}</p>
      <h1 className="og-page-h1">{t(L, "How the attack changed shape", "Cuộc tấn công đổi hình thế nào")}</h1>
      <p className="og-page-lede">{t(L,
        "The project did not push one method harder, it kept re-representing the problem. Each turn records why the previous representation stopped and what the new one exposed.",
        "Dự án không cố ép một phương pháp duy nhất mạnh hơn, mà liên tục biểu diễn lại bài toán theo cách mới. Mỗi bước chuyển đều ghi rõ vì sao cách cũ bế tắc và cách mới hé lộ thêm điều gì.")}</p>

      <div className="og-sec">{t(L, "Compression lens", "Ống kính nén")}</div>
      <div className="og-block og-block-pad">
        {lens.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "4px 0" }}>
            <span style={{ minWidth: 78, fontVariantNumeric: "tabular-nums", fontSize: 13, fontWeight: 600 }}>{r.n}</span>
            <span style={{ height: 24, borderRadius: 4, background: r.soft ? "var(--obs-line-strong)" : "var(--obs-ink)", width: `${r.w}%`, maxWidth: 520 }} />
            <span style={{ fontSize: 11.5, color: "var(--obs-ink-2)" }}>{t(L, r.cap[0], r.cap[1])}</span>
          </div>
        ))}
      </div>

      <div className="og-sec">{t(L, "Method evolution", "Tiến hóa phương pháp")}</div>
      <div className="og-block og-block-pad">
        <div className="og-deps">
          {evolution.map((e, i) => (
            <div className="og-dep" key={i} style={{ cursor: "default" }}>
              <span className="og-dep-rel">{String(i).padStart(2, "0")}</span>
              <span style={{ fontWeight: 600, fontSize: 13.5, minWidth: 190 }}>{e.m}</span>
              <span style={{ fontSize: 11.5, color: "var(--obs-ink-2)" }}>{t(L, e.stop[0], e.stop[1])}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="og-sec">{t(L, "Evidence ladder", "Thang bằng chứng")}</div>
      <div className="og-deps">
        {ladder.map((s, i) => (
          <div key={i} className="og-dep" style={{ cursor: "default", borderColor: i === 3 ? "var(--obs-ink)" : undefined, borderWidth: i === 3 ? 1.5 : 1, fontWeight: i === 3 ? 600 : 400 }}>
            <span className="og-dep-rel" style={{ minWidth: 20 }}>{i + 1}</span><span style={{ fontSize: 13 }}>{t(L, s[0], s[1])}</span>
            {i === 3 && <span style={{ fontSize: 11, color: "var(--obs-accent)", marginLeft: "auto" }}>← {t(L, "current work sits here", "công việc hiện tại ở đây")}</span>}
          </div>
        ))}
      </div>
    </main>
  );
}
