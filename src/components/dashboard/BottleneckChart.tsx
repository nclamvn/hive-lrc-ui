import { TrendingUp } from "lucide-react";
import type { Messages } from "@/i18n";
import { overviewDemoFixture } from "@/data/fixtures/overview.demo";

type BottleneckChartProps = {
  messages: Messages;
  data: typeof overviewDemoFixture.bottleneck;
};

/**
 * Custom deterministic SVG line chart, log-scale y axis.
 * Fixture values are illustrative and labelled as such per TIP §12.4.
 */
export function BottleneckChart({ messages, data }: BottleneckChartProps) {
  const W = 520;
  const H = 180;
  const PAD_L = 42;
  const PAD_R = 66;
  const PAD_T = 24;
  const PAD_B = 26;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const maxExp = 12;

  const xFor = (i: number) => PAD_L + (innerW * i) / (data.points.length - 1);
  const yFor = (v: number) => PAD_T + innerH - (innerH * Math.log10(v)) / maxExp;

  const pts = data.points.map((p, i) => ({ ...p, x: xFor(i), y: yFor(p.value) }));
  const solid = pts.slice(0, 4);
  const dashedPair = pts.slice(3);
  const bandX = xFor(3) + (xFor(4) - xFor(3)) * 0.42;
  const bandW = W - PAD_R - bandX + 40;

  const solidPath = solid.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const dashedPath = dashedPair
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  // superscript exponent labels like 8.3 × 10¹¹
  const pointLabel = (label: string) => {
    const m = label.match(/^([\d.]+) \\times 10\^\{(\d+)\}$/);
    if (!m) return { mantissa: label, exp: "" };
    return { mantissa: `${m[1]} × 10`, exp: m[2] };
  };

  return (
    <section className="card bottleneck-chart" aria-label={messages.chart.title} data-testid="bottleneck-chart">
      <header className="card-header">
        <span className="card-title-group">
          <TrendingUp className="card-title-icon" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="card-title">{messages.chart.title}</h2>
        </span>
      </header>
      <p className="chart-subtitle">
        {messages.chart.index}
        <span className="chart-subtitle-muted"> · {messages.chart.illustrative}</span>
      </p>
      <p className="visually-hidden">{messages.chart.summary}</p>
      <svg
        className="chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={messages.chart.title}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* hardness band over k=13 */}
        <rect x={bandX} y={PAD_T - 14} width={bandW} height={innerH + 14 + 8} className="chart-band" />
        <text x={bandX + bandW / 2} y={PAD_T + 56} className="chart-band-label">
          {messages.chart.hardnessJump.split(" ").map((word, i) => (
            <tspan key={i} x={bandX + bandW / 2} dy={i === 0 ? 0 : 13}>
              {word.toUpperCase()}
            </tspan>
          ))}
        </text>

        {/* y grid + tick labels */}
        {data.yTicks.map((e) => {
          const y = PAD_T + innerH - (innerH * e) / maxExp;
          return (
            <g key={e}>
              <line x1={PAD_L} x2={W - PAD_R + 30} y1={y} y2={y} className="chart-grid" vectorEffect="non-scaling-stroke" />
              <text x={PAD_L - 6} y={y + 3} className="chart-tick">
                10<tspan baselineShift="super" fontSize="7">{e}</tspan>
              </text>
            </g>
          );
        })}

        {/* line segments */}
        <path d={solidPath} className="chart-line" vectorEffect="non-scaling-stroke" />
        <path d={dashedPath} className="chart-line chart-line-dashed" vectorEffect="non-scaling-stroke" />

        {/* points + labels */}
        {pts.map((p, i) => {
          const { mantissa, exp } = pointLabel(p.label);
          const labelAbove = p.y - 10;
          return (
            <g key={p.k}>
              <circle cx={p.x} cy={p.y} r={4} className="chart-point" />
              <text
                x={i === pts.length - 1 ? p.x + 6 : p.x - 2}
                y={labelAbove}
                className="chart-point-label"
                textAnchor={i === pts.length - 1 ? "end" : "start"}
              >
                {mantissa}
                <tspan baselineShift="super" fontSize="7.5">{exp}</tspan>
              </text>
              <text x={p.x} y={H - 6} className="chart-x-label" textAnchor="middle">
                k = {p.k}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
