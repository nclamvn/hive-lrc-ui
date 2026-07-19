import katex from "katex";

export type MathProps = {
  latex: string;
  ariaLabel?: string;
};

/** Server-rendered inline KaTeX. Falls back to plain source on parse error. */
export function InlineMath({ latex, ariaLabel }: MathProps) {
  let html: string | null = null;
  try {
    html = katex.renderToString(latex, {
      displayMode: false,
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
      <code aria-label={ariaLabel} className="math-fallback">
        {latex}
      </code>
    );
  }

  return (
    <span
      role="img"
      aria-label={ariaLabel ?? latex}
      className="math-inline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
