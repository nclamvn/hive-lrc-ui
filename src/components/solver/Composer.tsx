"use client";

// Academic composer: LaTeX-aware textarea with live KaTeX preview, image paste,
// file/image attach (drag-drop + picker), IMO/Research mode switch, and an
// optional access key (for a deployed, secret-gated instance). Submits a fully
// formed payload up to the page.

import { useCallback, useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/hive-imo/Markdown";
import { t, type Locale } from "@/lib/imo/copy";
import type { SolveAttachment, SolveMode } from "@/lib/solver/types";

export interface ComposerPayload {
  mode: SolveMode;
  problem: string;
  attachments: SolveAttachment[];
  secret: string;
}

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per file

function fileToAttachment(file: File): Promise<SolveAttachment | null> {
  return new Promise((resolve) => {
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if ((!isImage && !isPdf) || file.size > MAX_BYTES) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const base64 = result.slice(result.indexOf(",") + 1);
      resolve({
        kind: isImage ? "image" : "pdf",
        mediaType: file.type,
        dataBase64: base64,
        name: file.name,
      });
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export function Composer({
  locale,
  streaming,
  onSubmit,
  onStop,
}: {
  locale: Locale;
  streaming: boolean;
  onSubmit: (payload: ComposerPayload) => void;
  onStop: () => void;
}) {
  const [mode, setMode] = useState<SolveMode>("imo");
  const [problem, setProblem] = useState("");
  const [attachments, setAttachments] = useState<SolveAttachment[]>([]);
  const [preview, setPreview] = useState(false);
  const [secret, setSecret] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSecret(localStorage.getItem("solver-secret") ?? "");
  }, []);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const parsed = await Promise.all(Array.from(files).map(fileToAttachment));
    const ok = parsed.filter((a): a is SolveAttachment => a !== null);
    if (ok.length) setAttachments((cur) => [...cur, ...ok].slice(0, 6));
  }, []);

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const files = Array.from(e.clipboardData.files);
      if (files.length) {
        e.preventDefault();
        void addFiles(files);
      }
    },
    [addFiles],
  );

  const submit = () => {
    if (streaming) return;
    if (!problem.trim() && attachments.length === 0) return;
    localStorage.setItem("solver-secret", secret);
    onSubmit({ mode, problem, attachments, secret });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className="sv-composer"
      data-drag={dragOver}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        void addFiles(e.dataTransfer.files);
      }}
    >
      <div className="sv-composer-top">
        <div className="sv-modes" role="tablist" aria-label={t(locale, "Mode", "Chế độ")}>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "imo"}
            className="sv-mode"
            data-on={mode === "imo"}
            onClick={() => setMode("imo")}
          >
            HIVE IMO
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "research"}
            className="sv-mode"
            data-on={mode === "research"}
            onClick={() => setMode("research")}
          >
            HIVE Research
          </button>
        </div>
        <button
          type="button"
          className="sv-link-btn"
          onClick={() => setPreview((v) => !v)}
        >
          {preview
            ? t(locale, "Edit", "Sửa")
            : t(locale, "Preview LaTeX", "Xem trước LaTeX")}
        </button>
      </div>

      {preview ? (
        <div className="sv-preview">
          {problem.trim() ? (
            <Markdown>{problem}</Markdown>
          ) : (
            <span className="sv-faint">
              {t(locale, "Nothing to preview yet.", "Chưa có gì để xem trước.")}
            </span>
          )}
        </div>
      ) : (
        <textarea
          className="sv-textarea"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
          rows={6}
          placeholder={t(
            locale,
            "Write or paste a problem. LaTeX supported: $a^2+b^2=c^2$ or $$\\int_0^1 x\\,dx$$. Paste an image, or drop a file.",
            "Viết hoặc dán một bài toán. Hỗ trợ LaTeX: $a^2+b^2=c^2$ hoặc $$\\int_0^1 x\\,dx$$. Dán ảnh, hoặc thả tệp vào.",
          )}
        />
      )}

      {attachments.length > 0 && (
        <div className="sv-attachments">
          {attachments.map((a, i) => (
            <span key={i} className="sv-chip">
              {a.kind === "image" ? "🖼" : "📄"} {a.name ?? a.kind}
              <button
                type="button"
                aria-label={t(locale, "Remove", "Bỏ")}
                onClick={() =>
                  setAttachments((cur) => cur.filter((_, j) => j !== i))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="sv-composer-foot">
        <div className="sv-foot-left">
          <button
            type="button"
            className="sv-attach-btn"
            onClick={() => fileRef.current?.click()}
          >
            {t(locale, "Attach", "Đính kèm")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <input
            type="password"
            className="sv-secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={t(locale, "Access key (if set)", "Khóa truy cập (nếu có)")}
            autoComplete="off"
          />
        </div>
        {streaming ? (
          <button type="button" className="sv-submit sv-stop" onClick={onStop}>
            {t(locale, "Stop", "Dừng")}
          </button>
        ) : (
          <button
            type="button"
            className="sv-submit"
            onClick={submit}
            disabled={!problem.trim() && attachments.length === 0}
          >
            {t(locale, "Solve", "Giải")} <span className="sv-kbd">⌘↵</span>
          </button>
        )}
      </div>
    </div>
  );
}
