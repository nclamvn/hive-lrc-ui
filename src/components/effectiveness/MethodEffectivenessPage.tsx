import type { Locale } from "@/i18n";
import { effectivenessData, representationRows } from "@/data/effectiveness/methodEffectivenessData";

const copy = {
  vi: {
    eyebrow: "HIVE-LRC · Bằng chứng nội bộ",
    title: "Hiệu quả phương pháp",
    subtitle: "Trực quan hóa mức giảm tính toán, độ mạnh kiểm chứng, các nhánh đã bị bác và ranh giới còn mở.",
    strongest: "Kết quả mạnh nhất hiện tại",
    status: "D5 PASS · tight interface mọi p>182 · I2",
    raw: "Miền chính xác",
    reps: "Đại diện orbit chính xác",
    producer: "Thời gian producer",
    trust: "Kiểm chứng",
    exact: "14^13 trạng thái",
    allProper: "16.171/16.171 proper",
    ram: "RAM đỉnh 43 MB",
    trustNote: "2 verifier · D4 16/16 + D5 18/18 corruption bị từ chối",
    reductionTitle: "Giảm độ lớn biểu diễn",
    reductionCaption: "Thang log. Đây là số đối tượng biểu diễn/công việc, không phải tuyên bố tăng tốc runtime.",
    labels: {
      full: "Toàn tight domain",
      lift: "Naive LIFT×7",
      vectors: "Folded count-vectors",
      orbits: "Residual orbit-classes",
    },
    ratioDomain: "giảm biểu diễn domain → representatives",
    ratioWork: "giảm work objects LIFT×7 → representatives",
    massTitle: "Đồng nhất khối lượng chính xác",
    massCaption: "Ba phần cộng đúng bằng toàn miền 14^13.",
    decisionTitle: "Đường ra quyết định nghiên cứu",
    decisionCaption: "Các nhánh thất bại được giữ lại như bằng chứng, không bị che.",
    verificationTitle: "Ngăn xếp kiểm chứng",
    closedTitle: "Đã đóng trong scope hiện tại",
    openTitle: "Còn mở",
    gatesTitle: "Tiến trình gate",
    scopeNote: "Scope: D4 đóng tight interface k=13 tại p=191; D5 mở rộng thành định lý proper cho MỌI prime p>182 (ngưỡng P0=78, 0 ngoại lệ). Các stage non-tight và LRC(13) vẫn mở.",
  },
  en: {
    eyebrow: "HIVE-LRC · Internal evidence",
    title: "Method Effectiveness",
    subtitle: "A visual account of computational reduction, verification strength, falsified branches, and remaining scope.",
    strongest: "Strongest current result",
    status: "D5 PASS · tight interface for all p>182 · I2",
    raw: "Exact domain",
    reps: "Exact orbit representatives",
    producer: "Producer time",
    trust: "Verification",
    exact: "14^13 states",
    allProper: "16,171/16,171 proper",
    ram: "43 MB peak RAM",
    trustNote: "2 verifiers · D4 16/16 + D5 18/18 corruptions rejected",
    reductionTitle: "Representation reduction",
    reductionCaption: "Log scale. These are representation/work-object counts, not an end-to-end runtime speedup claim.",
    labels: {
      full: "Full tight domain",
      lift: "Naive LIFT×7",
      vectors: "Folded count vectors",
      orbits: "Residual orbit classes",
    },
    ratioDomain: "domain → representative reduction",
    ratioWork: "LIFT×7 work-object → representative reduction",
    massTitle: "Exact mass identity",
    massCaption: "The three parts add exactly to the full 14^13 domain.",
    decisionTitle: "Research decision path",
    decisionCaption: "Failed branches remain visible as evidence.",
    verificationTitle: "Verification stack",
    closedTitle: "Closed in the current scope",
    openTitle: "Still open",
    gatesTitle: "Gate progression",
    scopeNote: "Scope: D4 closes the k=13 tight interface at p=191; D5 lifts it to a theorem proper for EVERY prime p>182 (threshold P0=78, 0 exceptions). Non-tight stages and LRC(13) remain open.",
  },
} as const;

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const logWidth = (value: number) => {
  const min = Math.log10(effectivenessData.orbitClasses);
  const max = Math.log10(effectivenessData.rawDomain);
  return 8 + ((Math.log10(value) - min) / (max - min)) * 92;
};

export function MethodEffectivenessPage({ locale = "vi" }: { locale?: Locale }) {
  const t = copy[locale];
  const path: Array<[string, string]> = [
    ["partial", locale === "vi" ? "Chiến dịch certificate thô" : "Raw certificate campaign"],
    ["pass", locale === "vi" ? "Squeeze quotient thành công" : "Squeeze quotient succeeds"],
    ["refuted", locale === "vi" ? "LIFT tường minh vượt cap" : "Explicit LIFT exceeds caps"],
    ["refuted", locale === "vi" ? "Prime-field shortcut sai cho 14" : "Prime-field shortcut fails for 14"],
    ["refuted", locale === "vi" ? "CRT affine landing bị bác" : "CRT affine landing refuted"],
    ["partial", locale === "vi" ? "Phát hiện direct properness" : "Direct properness discovered"],
    ["pass", locale === "vi" ? "Đóng orbit chính xác p=191" : "Exact p=191 orbit closure"],
    ["pass", locale === "vi" ? "Uniform-prime transfer ∀ p>182" : "Uniform-prime transfer ∀ p>182"],
  ];

  const checks = locale === "vi"
    ? [
        "Mass identity đúng chính xác bằng 14^13",
        "Burnside = canonical augmentation = 16.171",
        "Mọi đại diện có witness properness",
        "V1 và V2 độc lập cùng ACCEPT (D4 và D5)",
        "D4 16/16 + D5 18/18 corruption semantic bị từ chối",
      ]
    : [
        "Exact mass identity equals 14^13",
        "Burnside = canonical augmentation = 16,171",
        "Every representative has a properness witness",
        "V1 and V2 independently ACCEPT (D4 and D5)",
        "D4 16/16 + D5 18/18 semantic corruptions rejected",
      ];

  const closed = locale === "vi"
    ? ["Orbit partition chính xác tại p=191 (D4)", "Mass identity toàn miền 14^13", "16.171 representative proper", "Uniform transfer mọi prime p>182 (D5)"]
    : ["Exact orbit partition at p=191 (D4)", "Full-domain mass identity 14^13", "16,171 proper representatives", "Uniform transfer for all primes p>182 (D5)"];

  const open = locale === "vi"
    ? ["Các stage non-tight của rút gọn k=13", "Full k=13 reduction", "LRC(13)"]
    : ["Non-tight stages of the k=13 reduction", "Full k=13 reduction", "LRC(13)"];

  return (
    <div className="eff-page" data-testid="effectiveness-page">
      <div className="eff-shell">
        <header className="eff-topline">
          <div>
            <div className="eff-eyebrow">{t.eyebrow}</div>
            <h1 className="eff-title">{t.title}</h1>
            <p className="eff-subtitle">{t.subtitle}</p>
          </div>
          <div className="eff-status"><b>{t.strongest}</b><br />{t.status}</div>
        </header>

        <section className="eff-grid4" aria-label="Key indicators">
          <article className="eff-card"><div className="eff-card-label">{t.raw}</div><div className="eff-card-value">{fmt(effectivenessData.rawDomain)}</div><div className="eff-card-note">{t.exact}</div></article>
          <article className="eff-card"><div className="eff-card-label">{t.reps}</div><div className="eff-card-value">{fmt(effectivenessData.orbitClasses)}</div><div className="eff-card-note">{t.allProper}</div></article>
          <article className="eff-card"><div className="eff-card-label">{t.producer}</div><div className="eff-card-value">{effectivenessData.producerSeconds}s</div><div className="eff-card-note">{t.ram}</div></article>
          <article className="eff-card"><div className="eff-card-label">{t.trust}</div><div className="eff-card-value">{effectivenessData.verifiers} / {effectivenessData.verifiers}</div><div className="eff-card-note">{t.trustNote}</div></article>
        </section>

        <section className="eff-section">
          <div className="eff-section-head"><h2>{t.reductionTitle}</h2><div className="eff-caption">{t.reductionCaption}</div></div>
          {representationRows.map((row) => (
            <div className="eff-reduction-row" key={row.key}>
              <div className="eff-row-label">{t.labels[row.key as keyof typeof t.labels]}</div>
              <div className="eff-bar-track"><div className="eff-bar" style={{ width: `${logWidth(row.value)}%` }} /></div>
              <div className="eff-row-value">{fmt(row.value)}</div>
            </div>
          ))}
          <div className="eff-ratios">
            <div className="eff-ratio"><strong>49.08B×</strong><span>{t.ratioDomain}</span></div>
            <div className="eff-ratio"><strong>5.99M×</strong><span>{t.ratioWork}</span></div>
          </div>
        </section>

        <section className="eff-section">
          <div className="eff-section-head"><h2>{t.massTitle}</h2><div className="eff-caption">{t.massCaption}</div></div>
          <div className="eff-mass" role="img" aria-label="B0 B1 residual mass proportions">
            <div className="eff-mass-b0" />
            <div className="eff-mass-b1" />
            <div className="eff-mass-res" />
          </div>
          <div className="eff-mass-legend">
            <div className="eff-legend-item"><b>B0 · 38.159%</b><span>{fmt(effectivenessData.mass.b0)}</span></div>
            <div className="eff-legend-item"><b>B1 · 0.144%</b><span>{fmt(effectivenessData.mass.b1)}</span></div>
            <div className="eff-legend-item"><b>Residual · 61.697%</b><span>{fmt(effectivenessData.mass.residual)}</span></div>
          </div>
          <div className="eff-equation">{fmt(effectivenessData.mass.b0)} + {fmt(effectivenessData.mass.b1)} + {fmt(effectivenessData.mass.residual)} = {fmt(effectivenessData.mass.total)} = 14^13</div>
        </section>

        <section className="eff-section">
          <div className="eff-section-head"><h2>{t.decisionTitle}</h2><div className="eff-caption">{t.decisionCaption}</div></div>
          <div className="eff-path">
            {path.map(([status, label]) => <div key={label} className={`eff-node ${status}`}><div className="eff-node-status">{status}</div><strong>{label}</strong></div>)}
          </div>
        </section>

        <div className="eff-two">
          <section className="eff-section eff-section-flush">
            <div className="eff-section-head"><h2>{t.verificationTitle}</h2></div>
            <ul className="eff-checklist">{checks.map((x) => <li key={x}><span className="eff-mark closed" /><span>{x}</span></li>)}</ul>
          </section>
          <section className="eff-section eff-section-flush">
            <div className="eff-two eff-two-flush">
              <div><h2 className="eff-subhead">{t.closedTitle}</h2><ul className="eff-checklist">{closed.map((x) => <li key={x}><span className="eff-mark closed" /><span>{x}</span></li>)}</ul></div>
              <div><h2 className="eff-subhead">{t.openTitle}</h2><ul className="eff-checklist">{open.map((x) => <li key={x}><span className="eff-mark open" /><span>{x}</span></li>)}</ul></div>
            </div>
          </section>
        </div>

        <section className="eff-section">
          <div className="eff-section-head"><h2>{t.gatesTitle}</h2></div>
          <div className="eff-gates">
            {effectivenessData.gates.map(([gate, status]) => <div className={`eff-gate ${status}`} key={gate}><b>{gate}</b><span>{status}</span></div>)}
          </div>
        </section>

        <div className="eff-footer-note">{t.scopeNote}</div>
      </div>
    </div>
  );
}
