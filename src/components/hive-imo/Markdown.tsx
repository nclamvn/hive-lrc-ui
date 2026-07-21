"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Renders a frozen problem statement: prose + inline ($...$) and display ($$...$$)
// math via KaTeX. Content originates from our own ledger, not user input.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="hi-md">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
