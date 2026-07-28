// Mock solve path: replays a scripted transcript through the SAME SolveEvent
// protocol as the real Claude path, token-by-token, so the whole UI (stage
// rail, streaming transcript, thinking panel, KaTeX) can be developed and
// demoed with zero API tokens. Selected when USE_REAL_MODEL is not "true".

import { stagesFor } from "@/lib/solver/prompts";
import type { SolveEvent, SolveRequest } from "@/lib/solver/types";

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error("aborted"));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new Error("aborted"));
      },
      { once: true },
    );
  });
}

// Stream a block of text word-by-word as `text` deltas.
async function streamText(
  text: string,
  emit: (e: SolveEvent) => void,
  signal: AbortSignal | undefined,
  ms = 18,
): Promise<void> {
  const tokens = text.match(/\s+|\S+/g) ?? [text];
  for (const tok of tokens) {
    emit({ type: "text", delta: tok });
    await sleep(ms, signal);
  }
}

async function streamThinking(
  text: string,
  emit: (e: SolveEvent) => void,
  signal: AbortSignal | undefined,
  ms = 10,
): Promise<void> {
  const tokens = text.match(/\s+|\S+/g) ?? [text];
  for (const tok of tokens) {
    emit({ type: "thinking", delta: tok });
    await sleep(ms, signal);
  }
}

const T = (locale: "en" | "vi", en: string, vi: string) =>
  locale === "vi" ? vi : en;

export async function runMockStream(
  req: SolveRequest,
  emit: (event: SolveEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const { locale } = req;
  const stages = stagesFor(req.mode);
  const snippet =
    req.problem.trim().slice(0, 120) ||
    T(locale, "the supplied problem", "bài toán đã cho");

  emit({ type: "text", delta: "" });
  await streamText(
    T(
      locale,
      `**Preview mode.** No model was called — this is a scripted walkthrough of the ${
        req.mode === "imo" ? "HIVE IMO" : "HIVE Research"
      } pipeline over: *${snippet}*\n\n`,
      `**Chế độ xem trước.** Chưa gọi model — đây là bản mô phỏng quy trình ${
        req.mode === "imo" ? "HIVE IMO" : "HIVE Research"
      } trên: *${snippet}*\n\n`,
    ),
    emit,
    signal,
  );

  // The proof-assembly / construction stage, where the lemma is forged.
  const proofId = req.mode === "imo" ? "S8" : "R4";
  const proofStage = Math.max(
    stages.findIndex((s) => s.id === proofId),
    0,
  );

  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    emit({ type: "stage", id: s.id, status: "active" });

    await streamThinking(
      T(
        locale,
        `Working ${s.id}: ${s.en}. Checking what this phase must establish before moving on. `,
        `Đang xử lý ${s.id}: ${s.vi}. Kiểm tra pha này cần thiết lập gì trước khi đi tiếp. `,
      ),
      emit,
      signal,
    );

    const label = T(locale, s.en, s.vi);
    let body = `\n## ${s.id} · ${label}\n\n`;
    if (i === 0) {
      body += T(
        locale,
        `Restating precisely. Let $n \\in \\mathbb{N}$ and consider the quantity\n$$S = \\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}.$$\nWe fix notation and the exact goal here.\n\n`,
        `Phát biểu lại chính xác. Cho $n \\in \\mathbb{N}$ và xét đại lượng\n$$S = \\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}.$$\nTa cố định ký hiệu và mục tiêu chính xác ở đây.\n\n`,
      );
    } else if (i === stages.length - 1) {
      body += T(
        locale,
        `**Conclusion.** The identity above closes the argument for all $n \\ge 1$.\n\n> Honesty note: this is a *preview* transcript, not a verified proof. Enable the real model (\`USE_REAL_MODEL=true\`) for an actual solution attempt.\n\n`,
        `**Kết luận.** Đẳng thức trên khép lại lập luận cho mọi $n \\ge 1$.\n\n> Ghi chú trung thực: đây là bản *xem trước*, không phải chứng minh đã kiểm chứng. Bật model thật (\`USE_REAL_MODEL=true\`) để có lời giải thực sự.\n\n`,
      );
    } else if (i === proofStage) {
      body += T(
        locale,
        `**Lemma 1.** For every $n \\ge 1$, $\\displaystyle\\sum_{k=1}^{n}(2k-1) = n^2$.\n\n*Proof.* Telescoping / induction on $n$. The base case $n=1$ gives $1=1^2$; the step adds $2(n+1)-1$ to $n^2$, yielding $(n+1)^2$. $\\square$\n\n`,
        `**Bổ đề 1.** Với mọi $n \\ge 1$, $\\displaystyle\\sum_{k=1}^{n}(2k-1) = n^2$.\n\n*Chứng minh.* Khử liên hoàn / quy nạp theo $n$. Cơ sở $n=1$ cho $1=1^2$; bước quy nạp cộng $2(n+1)-1$ vào $n^2$, được $(n+1)^2$. $\\square$\n\n`,
      );
    } else {
      body += T(
        locale,
        `We advance the argument: from the previous phase we have a bound of the form $|a_k| \\le C\\,k$, and induction on $k$ tightens it to $O(\\log k)$. This feeds the next stage.\n\n`,
        `Ta đẩy lập luận tiến lên: từ pha trước ta có chặn dạng $|a_k| \\le C\\,k$, và quy nạp theo $k$ siết lại thành $O(\\log k)$. Điều này nuôi pha kế tiếp.\n\n`,
      );
    }
    await streamText(body, emit, signal);

    // Fresh-context verifier demo: check the lemma when it appears, and flag the
    // final claim as not independently verified in preview mode.
    if (i === proofStage) {
      const vid = "v-lemma-1";
      emit({
        type: "verdict",
        verdict: {
          id: vid,
          claim: T(locale, "Lemma 1 (sum of odds = n²)", "Bổ đề 1 (tổng số lẻ = n²)"),
          status: "checking",
          stage: s.id,
        },
      });
      await sleep(400, signal);
      emit({
        type: "verdict",
        verdict: {
          id: vid,
          claim: T(locale, "Lemma 1 (sum of odds = n²)", "Bổ đề 1 (tổng số lẻ = n²)"),
          status: "verified",
          note: T(locale, "Induction checks out.", "Quy nạp đúng."),
          stage: s.id,
        },
      });
    }
    if (i === stages.length - 1) {
      emit({
        type: "verdict",
        verdict: {
          id: "v-final",
          claim: T(locale, "Full solution", "Toàn bộ lời giải"),
          status: "unverified",
          note: T(locale, "Preview mode — no model ran.", "Chế độ xem trước — chưa chạy model."),
          stage: s.id,
        },
      });
    }

    emit({ type: "stage", id: s.id, status: "done" });
    await sleep(120, signal);
  }

  emit({ type: "usage", input: 0, output: 0 });
}
