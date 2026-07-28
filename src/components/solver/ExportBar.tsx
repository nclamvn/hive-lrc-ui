"use client";

// Export a finished solve: copy Markdown, download .tex / .md, or print (which
// the browser can Save as PDF with KaTeX fully rendered).

import { useState } from "react";
import { t, type Locale } from "@/lib/imo/copy";
import { download, toLatex, toMarkdown } from "@/lib/solver/export";
import type { RunState } from "@/components/solver/useSolveStream";

export function ExportBar({
  run,
  locale,
}: {
  run: RunState;
  locale: Locale;
}) {
  const [copied, setCopied] = useState(false);
  const base = `hive-${run.mode}-${new Date().toISOString().slice(0, 10)}`;

  const copyMd = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(run));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  return (
    <div className="sv-export">
      <span className="sv-export-label">{t(locale, "Export", "Xuất")}</span>
      <button type="button" className="sv-export-btn" onClick={copyMd}>
        {copied ? t(locale, "Copied", "Đã chép") : t(locale, "Copy MD", "Chép MD")}
      </button>
      <button
        type="button"
        className="sv-export-btn"
        onClick={() => download(`${base}.md`, toMarkdown(run), "text/markdown")}
      >
        .md
      </button>
      <button
        type="button"
        className="sv-export-btn"
        onClick={() => download(`${base}.tex`, toLatex(run), "application/x-tex")}
      >
        .tex
      </button>
      <button
        type="button"
        className="sv-export-btn"
        onClick={() => window.print()}
      >
        {t(locale, "Print / PDF", "In / PDF")}
      </button>
    </div>
  );
}
