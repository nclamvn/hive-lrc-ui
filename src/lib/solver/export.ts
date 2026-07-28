// Export helpers: turn a finished solve into a downloadable Markdown or LaTeX
// document. The transcript is Markdown with $...$/$$...$$ math, so Markdown
// export is verbatim and LaTeX export converts the common Markdown subset while
// passing math through untouched.

import type { RunState } from "@/components/solver/useSolveStream";

const MODE_TITLE = { imo: "HIVE IMO", research: "HIVE Research" } as const;

export function toMarkdown(run: RunState): string {
  const lines: string[] = [];
  lines.push(`# ${MODE_TITLE[run.mode]} — solution\n`);
  if (run.problem) lines.push(`## Problem\n\n${run.problem}\n`);
  lines.push(run.text.trim());
  if (run.verdicts.length) {
    lines.push(`\n## Verification\n`);
    for (const v of run.verdicts) {
      lines.push(`- **${v.status}** — ${v.claim}${v.note ? ` (${v.note})` : ""}`);
    }
  }
  return lines.join("\n") + "\n";
}

// Escape LaTeX specials in prose, but NEVER inside math spans (handled by the
// caller, which only passes non-math text here).
function escapeTeX(s: string): string {
  return s
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

// Apply inline Markdown emphasis to a math-free text run.
function inlineToTeX(s: string): string {
  let out = escapeTeX(s);
  out = out.replace(/\*\*(.+?)\*\*/g, "\\textbf{$1}");
  out = out.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "\\emph{$1}");
  out = out.replace(/`(.+?)`/g, "\\texttt{$1}");
  return out;
}

// Convert one line's inline content, preserving $...$ and $$...$$ math spans.
function lineToTeX(line: string): string {
  const parts = line.split(/(\$\$[^$]*\$\$|\$[^$]*\$)/g);
  return parts
    .map((p) => (p.startsWith("$") ? p : inlineToTeX(p)))
    .join("");
}

export function toLatex(run: RunState): string {
  const body: string[] = [];
  const src = `${run.problem ? `**Problem.** ${run.problem}\n\n` : ""}${run.text}`;
  const rawLines = src.replace(/\r/g, "").split("\n");

  let inList = false;
  const closeList = () => {
    if (inList) {
      body.push("\\end{itemize}");
      inList = false;
    }
  };

  for (const raw of rawLines) {
    const line = raw.replace(/\s+$/, "");
    // Standalone display math on its own line.
    if (/^\$\$.*\$\$$/.test(line.trim())) {
      closeList();
      const inner = line.trim().replace(/^\$\$/, "").replace(/\$\$$/, "");
      body.push(`\\[${inner}\\]`);
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      closeList();
      const depth = h[1].length;
      const cmd = depth <= 1 ? "section" : depth === 2 ? "subsection" : "subsubsection";
      body.push(`\\${cmd}*{${lineToTeX(h[2])}}`);
      continue;
    }
    const li = /^[-*]\s+(.*)$/.exec(line);
    if (li) {
      if (!inList) {
        body.push("\\begin{itemize}");
        inList = true;
      }
      body.push(`  \\item ${lineToTeX(li[1])}`);
      continue;
    }
    const bq = /^>\s?(.*)$/.exec(line);
    if (bq) {
      closeList();
      body.push(`\\begin{quote}${lineToTeX(bq[1])}\\end{quote}`);
      continue;
    }
    if (line.trim() === "") {
      closeList();
      body.push("");
      continue;
    }
    closeList();
    body.push(lineToTeX(line));
  }
  closeList();

  return `\\documentclass[11pt]{article}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage[margin=1in]{geometry}
\\title{${MODE_TITLE[run.mode]} --- solution}
\\date{}
\\begin{document}
\\maketitle
${body.join("\n")}
\\end{document}
`;
}

export function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
