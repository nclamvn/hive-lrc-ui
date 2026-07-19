import Link from "next/link";
import { Crosshair, Sparkles, ShieldCheck, Boxes, Sigma, Binary, Network, GitBranch, Grid3x3 } from "lucide-react";
import type { GoldenVM } from "@/lib/goldenOverviewData";
import type { Locale } from "@/lib/observatory";
import { OverviewAttackMap } from "@/components/observatory-golden/OverviewAttackMap";
import { LonelyRunnerCircle } from "@/components/observatory/LonelyRunnerCircle";
import { MathText } from "@/components/observatory-golden/MathText";

const ICON: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  crosshair: Crosshair, sparkles: Sparkles, "shield-check": ShieldCheck, boxes: Boxes,
};

const STATUS_TOK: Record<string, string> = {
  pass: "tok-validated", partial: "tok-partial", blocked: "tok-blocked", current: "tok-current", refuted: "tok-refuted",
};

export function GoldenOverview({ locale, vm, golden = false }: { locale: Locale; vm: GoldenVM; golden?: boolean }) {
  const t = (en: string, vi: string) => (locale === "vi" ? vi : en);
  const base = `/${locale}/observatory`;

  return (
    <>
      {/* hero */}
      <section className="og-hero" data-region="hero">
        <div>
          <div className="og-eyebrow"><span className="og-live-dot" />{vm.hero.eyebrow}</div>
          <h1 className="og-hero-title">{vm.hero.title}</h1>
          <p className="og-hero-sub">{vm.hero.subtitle}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="og-vitruvian" src="/vitruvian.png" alt="" aria-hidden width={172} height={170} />
      </section>

      {/* the problem: live explainer + history timeline */}
      <section className="og-problem" data-region="problem">
        <div className="og-prob-body">
          <div className="og-eyebrow">{vm.problem.kicker}</div>
          <h2 className="og-prob-title">{vm.problem.title}</h2>
          <MathText className="og-prob-lede">{vm.problem.lede}</MathText>
          <ol className="og-timeline">
            {vm.problem.milestones.map((m) => (
              <li className="og-tl-row" key={m.year + m.label}>
                <span className="og-tl-year">{m.year}</span>
                <span className="og-tl-main">
                  <span className="og-tl-label">{m.label}</span>
                  {m.note && <span className="og-tl-note">{m.note}</span>}
                </span>
              </li>
            ))}
          </ol>
          <MathText className="og-prob-impact">{vm.problem.impact}</MathText>
        </div>
        <div className="og-prob-viz">
          <LonelyRunnerCircle static={golden} labels={{ lonely: t("Lonely", "Cô đơn"), caption: vm.problem.caption }} />
        </div>
      </section>

      {/* metric cards */}
      <section className="og-metrics" data-region="metrics">
        {vm.metrics.map((m) => {
          const Ic = ICON[m.icon] ?? Crosshair;
          return (
            <div className={`og-card${m.accent ? " accent-wm" : ""}`} key={m.label}>
              <Ic size={72} strokeWidth={1} className="og-card-ico" aria-hidden />
              <div className="og-card-label">{m.label}</div>
              <div className={`og-card-value${m.accent ? " accent" : ""}`}>{m.value}{m.badge && <span className="og-card-badge">{m.badge}</span>}</div>
              <div className="og-card-desc">{m.description}</div>
              <div className="og-card-status"><span className="d" />{m.status}</div>
            </div>
          );
        })}
      </section>

      {/* latest result — featured */}
      <section className="og-featured" data-region="latest-result">
        <div className="og-feat-main">
          <div className="og-feat-head">
            <span className="og-feat-kicker">{vm.latest.kicker}</span>
            <span className="og-feat-phase">{vm.latest.phase}</span>
            <span className={`og-chip ${STATUS_TOK[vm.latest.status] ?? "tok-current"}`}>{vm.latest.statusLabel}</span>
          </div>
          <h3 className="og-feat-title">{vm.latest.title}</h3>
          <p className="og-feat-status">{vm.latest.statusLine}</p>
          <MathText className="og-feat-plain">{vm.latest.plain}</MathText>
          <Link className="og-feat-cta" href={vm.latest.href}>{vm.latest.cta}</Link>
        </div>
        <div className="og-feat-stats">
          {vm.latest.stats.map((s) => (
            <div className="og-feat-stat" key={s.label}>
              <span className="v">{s.value}</span>
              <span className="l">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* map + feed */}
      <section className="og-mid">
        <div className="og-panel" data-region="research-map">
          <div className="og-panel-h"><span className="og-panel-t">{t("Research Attack Map", "Bản đồ tấn công")}</span>
            <Link className="og-panel-a" href={`${base}/map`}>{t("Open full map →", "Mở bản đồ →")}</Link></div>
          <OverviewAttackMap nodes={vm.graph.nodes as never} edges={vm.graph.edges as never} locale={locale} />
        </div>

        <div className="og-panel" data-region="live-feed">
          <div className="og-panel-h"><span className="og-panel-t">{t("Live Research Feed", "Dòng nghiên cứu")}</span>
            <Link className="og-panel-a" href={`${base}/journal`}>{t("View all journal →", "Nhật ký →")}</Link></div>
          <div className="og-feed-body">
            {vm.feed.map((r) => (
              <div className="og-feed-row" key={r.seq}>
                <div className="og-feed-top">{r.time && <span className="og-feed-time">{r.time}</span>}<span className="og-feed-seq">{r.seq}</span><span className="og-feed-chip">{r.type}</span></div>
                <div className="og-feed-title">{r.title}</div>
                <div className="og-feed-desc">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* lower panels */}
      <section className="og-lower" data-region="lower-panels">
        <div className="og-lp">
          <div className="og-lp-t">{t("Evidence Ladder", "Thang bằng chứng")}</div>
          <div className="og-ladder">
            {[["5", t("Formal verification", "Kiểm chứng hình thức"), 0], ["4", t("Independent audit", "Audit độc lập"), 0], ["3", t("Supported internal · I2", "Có cơ sở nội bộ · I2"), 100], ["2", t("Validated bounded", "Thẩm định có chặn"), 100], ["1", t("Measured", "Đo được"), 100]].map(([n, l, w], i) => (
              <div className={`og-ladder-row${i === 2 ? " here" : ""}`} key={n as string}><span className="og-ladder-n">{n}</span><span className="og-ladder-lbl">{l}</span><span className="og-ladder-bar"><i style={{ width: `${w}%` }} /></span></div>
            ))}
          </div>
        </div>
        <div className="og-lp">
          <div className="og-lp-t">{t("Progress Overview", "Tổng quan tiến độ")}</div>
          <svg className="og-chart" viewBox="0 0 300 150" preserveAspectRatio="none">
            <line x1="0" y1="130" x2="300" y2="130" stroke="#e2e0da" /><line x1="0" y1="90" x2="300" y2="90" stroke="#f0efe9" /><line x1="0" y1="50" x2="300" y2="50" stroke="#f0efe9" />
            <polyline points="0,120 50,110 100,95 150,80 200,60 250,42 300,30" fill="none" stroke="#111" strokeWidth="1.5" />
            <polyline points="0,128 50,122 100,112 150,104 200,88 250,74 300,58" fill="none" stroke="#2f9b50" strokeWidth="1.5" />
            <polyline points="0,132 50,128 100,126 150,120 200,116 250,110 300,104" fill="none" stroke="#cbc8c0" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="og-lp">
          <div className="og-lp-t">{t("Bottleneck Frontier", "Điểm nghẽn")}</div>
          <table className="og-tbl">
            <thead><tr><th>{t("Issue", "Vấn đề")}</th><th>{t("Impact", "Mức")}</th><th>{t("Status", "Trạng thái")}</th></tr></thead>
            <tbody>
              {[[t("Support-5 order", "Support-5"), "P0", "active"], [t("Uniform budget", "Ngân sách đều"), "P0", ""], [t("Independent audit", "Audit độc lập"), "P1", ""], [t("Formal proof", "Chứng minh hình thức"), "P1", ""]].map(([a, b, s]) => (
                <tr key={a}><td>{a}</td><td>{b}</td><td><span className={`st${s ? " active" : ""}`}><span className="d" />{s ? t("Active", "Đang mở") : t("Monitoring", "Theo dõi")}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="og-lp og-lp-split">
          <div>
            <div className="og-lp-t">{t("Method Summary", "Phương pháp")}</div>
            <div className="og-methods">
              {[[Sigma, "Cumulant"], [Binary, "Modular"], [Network, "Projective"], [GitBranch, "Lattice"], [Grid3x3, "Cyclic"]].map(([Ic, l], i) => { const C = Ic as any; return <div className="og-method" key={i}><C size={16} strokeWidth={1.5} className="ic" /><span className="lb">{l as string}</span></div>; })}
            </div>
          </div>
          <div>
            <div className="og-lp-t">{t("At a Glance", "Tổng quan")}</div>
            <div className="og-glance">
              <div className="g"><div className="gv">109</div><div className="gl">{t("primes", "prime")}</div></div>
              <div className="g"><div className="gv">17</div><div className="gl">{t("gates", "gate")}</div></div>
              <div className="g"><div className="gv">I2</div><div className="gl">{t("evidence", "evidence")}</div></div>
              <div className="g"><div className="gv">52/52</div><div className="gl">{t("corruption", "tấn công")}</div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
