import { Info, CircleCheckBig, TriangleAlert } from "lucide-react";
import type { Locale } from "@/i18n";
import type { Block, Bi } from "@/data/wiki/content";
import { InlineMath } from "@/components/math/InlineMath";
import { BlockMath } from "@/components/math/BlockMath";
import { MilestoneTimeline } from "./MilestoneTimeline";
import { RelationshipGraph } from "@/components/dashboard/RelationshipGraph";

const CALLOUT = {
  note: { Icon: Info, cls: "callout-note" },
  result: { Icon: CircleCheckBig, cls: "callout-result" },
  warn: { Icon: TriangleAlert, cls: "callout-warn" },
} as const;

/** Render inline $...$ math inside wiki prose without a full markdown pipeline. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("$") && p.endsWith("$") ? (
          <InlineMath key={i} latex={p.slice(1, -1)} />
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function WikiBlocks({ blocks, locale }: { blocks: Block[]; locale: Locale }) {
  const tx = (o: Bi) => (locale === "vi" ? o.vi : o.en);
  return (
    <div className="wiki-blocks">
      {blocks.map((blk, i) => {
        switch (blk.kind) {
          case "prose":
            return <p key={i} className="wiki-prose"><RichText text={tx(blk.text)} /></p>;
          case "math":
            return (
              <figure key={i} className="wiki-math">
                <BlockMath latex={blk.latex} />
                {blk.caption && <figcaption><RichText text={tx(blk.caption)} /></figcaption>}
              </figure>
            );
          case "keyvalue":
            return (
              <dl key={i} className="wiki-kv">
                {blk.rows.map((r, j) => (
                  <div key={j} className="wiki-kv-row">
                    <dt><RichText text={tx(r.k)} /></dt>
                    <dd><RichText text={tx(r.v)} /></dd>
                  </div>
                ))}
              </dl>
            );
          case "table":
            return (
              <div key={i} className="wiki-table-wrap">
                <table className="wiki-table">
                  <thead>
                    <tr>{blk.head.map((h, j) => <th key={j} scope="col"><RichText text={tx(h)} /></th>)}</tr>
                  </thead>
                  <tbody>
                    {blk.rows.map((row, j) => (
                      <tr key={j}>{row.map((c, m) => <td key={m}><RichText text={tx(c)} /></td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout": {
            const { Icon, cls } = CALLOUT[blk.tone];
            return (
              <aside key={i} className={`wiki-callout ${cls}`}>
                <Icon className="callout-icon" strokeWidth={1.75} aria-hidden="true" />
                <p><RichText text={tx(blk.text)} /></p>
              </aside>
            );
          }
          case "list":
            return (
              <ul key={i} className="wiki-list">
                {blk.items.map((it, j) => <li key={j}><RichText text={tx(it)} /></li>)}
              </ul>
            );
          case "stat":
            return (
              <div key={i} className="wiki-stats">
                {blk.items.map((s, j) => (
                  <div key={j} className="wiki-stat">
                    <span className="wiki-stat-value"><RichText text={s.value} /></span>
                    <span className="wiki-stat-label"><RichText text={tx(s.label)} /></span>
                  </div>
                ))}
              </div>
            );
          case "milestones":
            return <MilestoneTimeline key={i} locale={locale} />;
          case "depgraph":
            return <RelationshipGraph key={i} locale={locale} variant="wiki" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
