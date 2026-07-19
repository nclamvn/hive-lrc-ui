import { Database } from "lucide-react";
import type { Messages } from "@/i18n";
import type { ResourceBucketVM } from "@/data/adapters/researchOverviewAdapter";

type ResourceProfileProps = {
  messages: Messages;
  buckets: ResourceBucketVM[];
};

function barFill(tone: string, index: number): string {
  if (tone === "light") return index % 2 === 0 ? "#c9c9c6" : "#b2b2ae";
  if (tone === "mid") return index % 2 === 0 ? "#3f3f3d" : "#8f8f8b";
  // dark: leading spike is black, the tail alternates dark/light
  if (index === 0) return "#101010";
  return index % 2 === 1 ? "#4a4a48" : "#a5a5a1";
}

function MiniHistogram({ bucket }: { bucket: ResourceBucketVM }) {
  const W = 90;
  const H = 54;
  const n = bucket.bars.length;
  const gap = 2.4;
  const barW = (W - 4 - gap * (n - 1)) / n;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="resource-histogram" aria-hidden="true">
      {bucket.bars.map((v, i) => {
        const h = Math.max(3, v * (H - 4));
        return (
          <rect
            key={i}
            x={2 + i * (barW + gap)}
            y={H - h}
            width={barW}
            height={h}
            rx={0.8}
            fill={barFill(bucket.tone, i)}
          />
        );
      })}
    </svg>
  );
}

export function ResourceProfile({ messages, buckets }: ResourceProfileProps) {
  return (
    <section className="card resource-profile" aria-label={messages.resources.title} data-testid="resource-profile">
      <header className="card-header">
        <span className="card-title-group">
          <Database className="card-title-icon" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="card-title">{messages.resources.title}</h2>
        </span>
      </header>
      <div className="resource-buckets">
        {buckets.map((b) => (
          <figure key={b.id} className="resource-bucket">
            <figcaption className="resource-bucket-id">{b.id}</figcaption>
            <MiniHistogram bucket={b} />
            <span className="resource-bucket-label">{b.label}</span>
          </figure>
        ))}
      </div>
      <p className="resource-footer">{messages.resources.bottleneck}</p>
    </section>
  );
}
