"use client";

// Like the ledger Markdown, but promotes mathematical structure to cards:
// a paragraph that opens with a bold **Lemma**, **Theorem**, **Proposition**,
// **Corollary**, **Claim**, or **Proof** keyword is rendered as a titled
// callout. Everything else renders as normal KaTeX markdown.

import ReactMarkdown, { type Components } from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const CARD_KEYWORDS = [
  "lemma",
  "theorem",
  "proposition",
  "corollary",
  "claim",
  "proof",
  "bổ đề",
  "định lý",
  "mệnh đề",
  "hệ quả",
  "khẳng định",
  "chứng minh",
];

// The `node` react-markdown passes to a component is a hast element. We only
// need to peek at the first child to detect a leading bold/emphasis keyword.
type HastText = { type: "text"; value: string };
type HastElement = {
  type: "element";
  tagName?: string;
  children?: Array<HastElement | HastText>;
};
type HastParagraph = { children?: Array<HastElement | HastText> };

function leadingKeyword(node: unknown): string | null {
  const first = (node as HastParagraph | undefined)?.children?.[0];
  if (!first || first.type !== "element") return null;
  if (first.tagName !== "strong" && first.tagName !== "em") return null;
  const text0 = first.children?.[0];
  const text = (text0 && text0.type === "text" ? text0.value : "").trim().toLowerCase();
  return CARD_KEYWORDS.find((k) => text.startsWith(k)) ?? null;
}

const components: Components = {
  p({ node, children }) {
    const kw = leadingKeyword(node);
    if (!kw) return <p>{children}</p>;
    const isProof = kw === "proof" || kw === "chứng minh";
    return (
      <div className={`sv-card ${isProof ? "sv-card-proof" : "sv-card-lemma"}`}>
        {children}
      </div>
    );
  },
};

export function SolverMarkdown({ children }: { children: string }) {
  return (
    <div className="hi-md sv-md">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
