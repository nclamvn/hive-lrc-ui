import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

type MathMarkdownProps = {
  content: string;
};

/**
 * Markdown with $...$ / $$...$$ math via KaTeX.
 * Raw HTML is never rendered (react-markdown default), trust:false.
 */
export function MathMarkdown({ content }: MathMarkdownProps) {
  return (
    <div className="math-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { strict: "warn", trust: false, throwOnError: false }],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
