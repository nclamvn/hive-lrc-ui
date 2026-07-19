import katex from "katex";

/**
 * Render a string containing inline math delimited by $...$ using KaTeX.
 * Server component: KaTeX renders to HTML at build time; the global
 * katex.min.css (imported in the locale layout) styles the output.
 */
export function MathText({ children, className }: { children: string; className?: string }) {
  const parts = children.split(/(\$[^$]+\$)/g);
  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.length > 2 && part.startsWith("$") && part.endsWith("$")) {
          const html = katex.renderToString(part.slice(1, -1), { throwOnError: false, output: "html" });
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
