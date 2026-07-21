import katex from "katex";

// Server-rendered KaTeX. Problem statements and lemmas render through this once
// the ledger carries frozen LaTeX; renders nothing extra for empty strings.
export function TeX({ children, display = false }: { children: string; display?: boolean }) {
  if (!children) return null;
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: display,
    output: "html",
  });
  return (
    <span
      className={display ? "hi-tex-display" : "hi-tex"}
      // KaTeX output is generated from our own ledger content, not user input.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
