import katex from "katex";
import type { MathProps } from "./InlineMath";

/** Server-rendered display-mode KaTeX. Falls back to plain source on parse error. */
export function BlockMath({ latex, ariaLabel }: MathProps) {
  let html: string | null = null;
  try {
    html = katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      strict: "warn",
      trust: false,
      output: "html",
    });
  } catch {
    html = null;
  }

  if (html === null) {
    return (
      <pre aria-label={ariaLabel} className="math-fallback">
        {latex}
      </pre>
    );
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? latex}
      className="math-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
