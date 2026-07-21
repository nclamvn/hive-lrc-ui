import type { Artifact } from "@/lib/imo/ledger";
import { t, type Locale } from "@/lib/imo/copy";

function shortSha(sha?: string): string {
  if (!sha) return "";
  return sha.length > 20 ? `${sha.slice(0, 10)}…${sha.slice(-6)}` : sha;
}

// Every downloadable artifact carries its SHA-256 (brief §7, §13). When the
// dossier is empty we say so plainly rather than showing dead download buttons.
export function ArtifactList({
  artifacts, locale, compact = false, emptyHint,
}: { artifacts: Artifact[]; locale: Locale; compact?: boolean; emptyHint?: string }) {
  if (!artifacts || artifacts.length === 0) {
    if (compact) return null;
    return (
      <div className="hi-empty">
        {emptyHint ??
          t(locale,
            "No proof dossier has been published for this problem yet. Downloads appear here with a SHA-256 checksum once artifacts are frozen.",
            "Chưa có proof dossier nào được công bố cho bài này. Khi artifact được freeze, mục tải xuống sẽ hiện kèm checksum SHA-256.")}
      </div>
    );
  }
  return (
    <div className="hi-artifacts">
      {artifacts.map((a) => {
        const inner = (
          <>
            <span className="name">{a.name}</span>
            {a.sha256 && <span className="sha" title={`sha256:${a.sha256}`}>sha256:{shortSha(a.sha256)}</span>}
          </>
        );
        return a.href ? (
          <a className="hi-artifact" key={a.name} href={a.href} download>{inner}</a>
        ) : (
          <div className="hi-artifact" key={a.name}>{inner}</div>
        );
      })}
    </div>
  );
}
