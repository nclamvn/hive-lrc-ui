// TIP-HIMO-S0-000 — reproducible freeze generator.
// Reads the stored raw official source, writes a per-problem dossier under
// public/imo2026/p{n}/official/ with SHA-256 manifests, and patches the six
// ledger records to OFFICIAL-FROZEN. Re-running reproduces identical bytes
// (except updated_at), which is what the gate's V1 "source replay" expects.
//
// Fable (Builder) transcribed the statements from the official rendering at
// https://www.imo-official.org/problems/?language=en (glyph-decoded from the
// MathJax SVG and visually confirmed). No solution material was accessed.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data", "imo2026");
const pubDir = join(root, "public", "imo2026");
const FETCHED_AT = "2026-07-21T09:00:00+07:00";
const UPDATED_AT = "2026-07-21T10:30:00+07:00"; // includes Sol attestation
const OFFICIAL_URL = "https://www.imo-official.org/problems/?language=en";
const EDITION_URL = "https://www.imo-official.org/editions/2026/";

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

const rawPage = readFileSync(join(pubDir, "official_source", "problems_2026.raw.html"), "utf8");
const rawPageSha = sha256(rawPage);

// Legacy solution manuscripts (created 2026-07-16, before the S0 website workflow).
// The Builder surfaces them as available + hashed; it does NOT assert correctness.
const LEGACY = {
  1: "IMO2026_Day1_Problem1.pdf", 2: "IMO2026_Day1_Problem2.pdf", 3: "IMO2026_Day1_Problem3.pdf",
  4: "IMO2026_Day2_Problem4.pdf", 5: "IMO2026_Day2_Problem5.pdf", 6: "IMO2026_Day2_Problem6.pdf",
};
const LEGACY_CREATED = "2026-07-16";
const legacySha = (n) =>
  createHash("sha256").update(readFileSync(join(pubDir, `p${n}`, "legacy", LEGACY[n]))).digest("hex");

// extract each official statement fragment verbatim from the raw source
function rawFragment(nStr) {
  const re = new RegExp(
    `<h3 class="problem-page__problem-number">Problem ${nStr}</h3>\\s*<div class="problem-page__problem-statement">([\\s\\S]*?)</div>\\s*(?=<div class="problem-page__problem"|</section|<h2)`,
  );
  const m = re.exec(rawPage);
  return m ? m[0] : "";
}

// ── Statements (EN transcribed exactly; VI faithful literal draft) ────────────
const P = {
  1: {
    domain_surface: "Number theory",
    en: String.raw`There are $2026$ integers greater than $1$ written on a blackboard, not necessarily different. In a move, Confucius chooses two integers $m>1$ and $n>1$ from different places on the blackboard and replaces these two integers with
$$\gcd(m,n) \qquad \text{and} \qquad \frac{\operatorname{lcm}(m,n)}{\gcd(m,n)}.$$
He continues to make moves while it is possible to do so.

(a) Prove that, regardless of the choices of Confucius, after finitely many moves, exactly one integer $M$ on the blackboard is greater than $1$.

(b) Prove that the value of $M$ does not depend on the choices of Confucius.

(Note that $\gcd(x,y)$ denotes the greatest common divisor of positive integers $x$ and $y$, and $\operatorname{lcm}(x,y)$ denotes the least common multiple of $x$ and $y$.)`,
    vi: String.raw`Có $2026$ số nguyên lớn hơn $1$ được viết trên một tấm bảng, không nhất thiết khác nhau. Trong một nước đi, Confucius chọn hai số nguyên $m>1$ và $n>1$ ở hai vị trí khác nhau trên bảng và thay hai số này bằng
$$\gcd(m,n) \qquad \text{và} \qquad \frac{\operatorname{lcm}(m,n)}{\gcd(m,n)}.$$
Ông ấy tiếp tục thực hiện các nước đi khi còn có thể.

(a) Chứng minh rằng, bất kể Confucius chọn thế nào, sau hữu hạn nước đi, có đúng một số nguyên $M$ trên bảng lớn hơn $1$.

(b) Chứng minh rằng giá trị của $M$ không phụ thuộc vào cách chọn của Confucius.

(Ở đây $\gcd(x,y)$ ký hiệu ước chung lớn nhất của các số nguyên dương $x$ và $y$, và $\operatorname{lcm}(x,y)$ ký hiệu bội chung nhỏ nhất của $x$ và $y$.)`,
  },
  2: {
    domain_surface: "Geometry",
    en: String.raw`Let $ABC$ be a triangle and let points $M$ and $N$ be the midpoints of sides $AB$ and $AC$, respectively. Let points $K$ and $L$ be chosen strictly inside triangles $BMC$ and $BNC$, respectively, such that $K$ lies strictly inside triangle $ABL$ and $L$ lies strictly inside triangle $AKC$. Suppose that
$$\angle KBA=\angle ACL,\qquad \angle LBK=\angle LNC,\qquad \text{and}\qquad \angle LCK=\angle BMK.$$
Let $O$ be the circumcentre of triangle $AKL$. Prove that $OM=ON$.`,
    vi: String.raw`Cho tam giác $ABC$ và gọi $M$, $N$ lần lượt là trung điểm của các cạnh $AB$ và $AC$. Chọn các điểm $K$ và $L$ nằm hoàn toàn bên trong các tam giác $BMC$ và $BNC$ tương ứng, sao cho $K$ nằm hoàn toàn bên trong tam giác $ABL$ và $L$ nằm hoàn toàn bên trong tam giác $AKC$. Giả sử rằng
$$\angle KBA=\angle ACL,\qquad \angle LBK=\angle LNC,\qquad \text{và}\qquad \angle LCK=\angle BMK.$$
Gọi $O$ là tâm đường tròn ngoại tiếp tam giác $AKL$. Chứng minh rằng $OM=ON$.`,
  },
  3: {
    domain_surface: "Combinatorics",
    en: String.raw`Let $n$ be a positive integer. Liu Bang and Xiang Yu have a stick of length $1$ and want to divide it between themselves. Liu marks at most $n$ points on the stick, and then Xiang marks at most $n$ points on the stick. The marked points are distinct. Then, the stick is cut at all marked points, creating a number of pieces. Afterwards, they take turns claiming any unclaimed piece of the stick, with Liu going first. Each player's goal is to maximise the total length of their own pieces.

For each $n$, determine the largest value $c$ such that Liu may guarantee a total length of at least $c$, regardless of Xiang's play.`,
    vi: String.raw`Cho $n$ là một số nguyên dương. Liu Bang và Xiang Yu có một chiếc gậy dài $1$ và muốn chia nó cho nhau. Liu đánh dấu nhiều nhất $n$ điểm trên gậy, sau đó Xiang đánh dấu nhiều nhất $n$ điểm trên gậy. Các điểm được đánh dấu là phân biệt. Sau đó, chiếc gậy được cắt tại tất cả các điểm đã đánh dấu, tạo thành một số mảnh. Tiếp theo, họ lần lượt nhận bất kỳ mảnh nào chưa được nhận, Liu đi trước. Mục tiêu của mỗi người chơi là tối đa hóa tổng độ dài các mảnh của mình.

Với mỗi $n$, hãy xác định giá trị lớn nhất $c$ sao cho Liu có thể bảo đảm tổng độ dài ít nhất bằng $c$, bất kể Xiang chơi thế nào.`,
  },
  4: {
    domain_surface: "Combinatorics / Geometry",
    en: String.raw`Shan-Yu and Mulan are playing a game. Let $\theta$ be an angle with $0^\circ<\theta<180^\circ$ known to both players. Initially, Shan-Yu makes a paper triangle $\mathcal{T}$ with measurements of his choice. Then, they repeatedly perform the following steps:

- If $\mathcal{T}$ has at least one angle measuring exactly $\theta$, then the game stops and Mulan wins.
- Otherwise, Mulan chooses a point $P$ on the perimeter of $\mathcal{T}$, different from its three vertices. She then makes a straight cut from $P$ to the opposite vertex of $\mathcal{T}$, splitting it into two triangles.
- Shan-Yu discards one of the two triangles. The remaining triangle becomes the new $\mathcal{T}$.

For which real values of $\theta$ can Mulan guarantee her victory in finitely many steps, no matter how Shan-Yu plays?`,
    vi: String.raw`Shan-Yu và Mulan chơi một trò chơi. Cho $\theta$ là một góc với $0^\circ<\theta<180^\circ$ mà cả hai người chơi đều biết. Ban đầu, Shan-Yu làm một tam giác bằng giấy $\mathcal{T}$ với các số đo tùy ý theo lựa chọn của mình. Sau đó, họ lặp lại các bước sau:

- Nếu $\mathcal{T}$ có ít nhất một góc bằng đúng $\theta$, thì trò chơi dừng lại và Mulan thắng.
- Ngược lại, Mulan chọn một điểm $P$ trên chu vi của $\mathcal{T}$, khác ba đỉnh của nó. Sau đó cô cắt thẳng từ $P$ đến đỉnh đối diện của $\mathcal{T}$, chia nó thành hai tam giác.
- Shan-Yu bỏ đi một trong hai tam giác. Tam giác còn lại trở thành $\mathcal{T}$ mới.

Với những giá trị thực nào của $\theta$ thì Mulan có thể bảo đảm chiến thắng của mình sau hữu hạn bước, bất kể Shan-Yu chơi thế nào?`,
  },
  5: {
    domain_surface: "Algebra (functional equation)",
    en: String.raw`Let $\mathbb{R}_{>0}$ be the set of positive real numbers. Determine all functions $f\colon \mathbb{R}_{>0}\to\mathbb{R}_{>0}$ such that
$$\sqrt{\frac{x^2+f(y)^2}{2}} \;\ge\; \frac{f(x)+y}{2} \;\ge\; \sqrt{x\,f(y)}$$
for every $x,y\in\mathbb{R}_{>0}$.`,
    vi: String.raw`Cho $\mathbb{R}_{>0}$ là tập các số thực dương. Hãy xác định tất cả các hàm số $f\colon \mathbb{R}_{>0}\to\mathbb{R}_{>0}$ sao cho
$$\sqrt{\frac{x^2+f(y)^2}{2}} \;\ge\; \frac{f(x)+y}{2} \;\ge\; \sqrt{x\,f(y)}$$
với mọi $x,y\in\mathbb{R}_{>0}$.`,
  },
  6: {
    domain_surface: "Number theory",
    en: String.raw`Let $a_1,a_2,a_3,\ldots$ be an infinite sequence of positive integers greater than $1$. Suppose that for all positive integers $n$, the number $a_{n+1}$ is the smallest positive integer greater than $a_n$ such that $\gcd(a_{n+1},a_i)>1$ for every $i=1,2,\ldots,n$. Prove that there exist positive integers $T$ and $L$ such that
$$a_{n+T}=a_n+L$$
for every positive integer $n$.

(Note that $\gcd(x,y)$ denotes the greatest common divisor of positive integers $x$ and $y$.)`,
    vi: String.raw`Cho $a_1,a_2,a_3,\ldots$ là một dãy vô hạn các số nguyên dương lớn hơn $1$. Giả sử rằng với mọi số nguyên dương $n$, số $a_{n+1}$ là số nguyên dương nhỏ nhất lớn hơn $a_n$ sao cho $\gcd(a_{n+1},a_i)>1$ với mọi $i=1,2,\ldots,n$. Chứng minh rằng tồn tại các số nguyên dương $T$ và $L$ sao cho
$$a_{n+T}=a_n+L$$
với mọi số nguyên dương $n$.

(Ở đây $\gcd(x,y)$ ký hiệu ước chung lớn nhất của các số nguyên dương $x$ và $y$.)`,
  },
};

// ── contamination ledger: Fable can only attest to its own exposure ───────────
function contaminationLedger(pid) {
  const clean = {
    official_solution_viewed: false,
    unofficial_solution_viewed: false,
    discussion_or_hint_viewed: false,
    social_media_solution_viewed: false,
    prior_memory_claimed: false,
  };
  return {
    problem_id: pid,
    actors: {
      human: {
        // official-source exposure (IMO organiser material)
        official_solution_viewed: "UNKNOWN",
        unofficial_solution_viewed: "UNKNOWN",
        discussion_or_hint_viewed: "UNKNOWN",
        social_media_solution_viewed: "UNKNOWN",
        prior_memory_claimed: "UNKNOWN",
        // internal-project exposure (the HIVE-IMO X legacy manuscripts, dated 2026-07-16)
        internal_project_solution_exposure: "UNKNOWN",
        blind_read_eligibility: "NOT-ESTABLISHED",
        notes: "Fable cannot attest to the Human's official-source exposure (unknown ≠ false). Legacy solution manuscripts exist in the project, so Human blind-read eligibility is NOT-ESTABLISHED until the Owner attests. Independence from the IMO official solution is a separate matter and remains NONE.",
      },
      sol: {
        ...clean,
        internal_project_solution_exposure: true,
        blind_read_eligibility: "NO",
        notes: "Sol (Contractor) attestation: viewed only the official IMO 2026 problem page for source review; no IMO official/unofficial solution accessed. However, the HIVE-IMO X project already contains legacy solution manuscripts for P1–P6, so Sol's internal-project solution exposure is TRUE and Sol is not eligible for a genuine AI blind read of these problems.",
      },
      fable: {
        ...clean,
        internal_project_solution_exposure: true,
        blind_read_eligibility: "NO",
        notes: "Fable attests no recalled IMO 2026 solution/hint was in its active context before S0, and it accessed only the official statements from the organiser. But Fable has now read the legacy project manuscripts during reconciliation, so internal-project solution exposure is TRUE and Fable is not eligible for a genuine blind read. official_solution_viewed refers to IMO organiser material only.",
      },
    },
    updated_at: UPDATED_AT,
  };
}

const writeHashed = (files, dir) => {
  const manifest = [];
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content);
    manifest.push(`${sha256(content)}  ${name}`);
  }
  const manifestBody = manifest.join("\n") + "\n";
  writeFileSync(join(dir, "MANIFEST.sha256"), manifestBody);
  return { manifestBody, manifestSha: sha256(manifestBody) };
};

for (let n = 1; n <= 6; n++) {
  const pid = `IMO2026-P${n}`;
  const p = P[n];
  const dir = join(pubDir, `p${n}`, "official");
  mkdirSync(dir, { recursive: true });

  const frag = rawFragment(String(n));
  const enMd = `# IMO 2026 · Problem ${n}\n\n${p.en}\n`;
  const viDraft = `# IMO 2026 · Bài ${n} (bản dịch nháp — Fable, chờ Human duyệt)\n\n${p.vi}\n`;
  // Per Contractor review: this file must NOT present as "reviewed" until Human V3.
  const viReviewed = `# IMO 2026 · Bài ${n} — bản dịch (V3 CHƯA HOÀN TẤT)\n\nSTATUS: PENDING-HUMAN-V3 — chưa được Human kiểm dòng-đối-dòng. Không dùng làm bản dịch chính thức cho tới khi Human xác nhận.\n\nBản nháp hiện tại (do Fable soạn, để tham chiếu khi Human rà soát):\n\n${p.vi}\n`;
  const normalized = JSON.stringify({
    problem_id: pid, day: n <= 3 ? 1 : 2, number: n, language: "en",
    statement_markdown: p.en,
    normalization_changes: [
      "Rendering-only: MathJax SVG glyphs transcribed to LaTeX ($...$ / $$...$$). No semantic change.",
      "Whitespace collapsed; problem parts kept as in source (e.g. (a)/(b), bulleted steps).",
    ],
    semantic_content_unchanged: true,
  }, null, 2) + "\n";

  const enFragHtml = frag + "\n";
  const source = JSON.stringify({
    problem_id: pid,
    official_source_url: OFFICIAL_URL,
    edition_url: EDITION_URL,
    fetched_at: FETCHED_AT,
    http_status: 200,
    fetch_method: "curl GET (raw HTML) + glyph decode + browser visual confirmation",
    fetched_by: "Fable (Claude Code, Builder)",
    raw_page_file: "/imo2026/official_source/problems_2026.raw.html",
    raw_page_sha256: rawPageSha,
    statement_fragment_sha256: sha256(enFragHtml),
    normalized_sha256: sha256(normalized),
  }, null, 2) + "\n";
  const contam = JSON.stringify(contaminationLedger(pid), null, 2) + "\n";

  const files = {
    "problem_en.raw.html": enFragHtml,
    "problem_en.md": enMd,
    "problem_en.normalized.json": normalized,
    "problem_vi.human-draft.md": viDraft,
    "problem_vi.reviewed.md": viReviewed,
    "source_record.json": source,
    "contamination_ledger.json": contam,
  };
  const { manifestSha } = writeHashed(files, dir);

  // patch the ledger record
  const recPath = join(dataDir, `${pid}.json`);
  const rec = JSON.parse(readFileSync(recPath, "utf8"));
  // Contractor verdict PARTIAL-SOURCE: not yet PASS-OFFICIAL-FREEZE. The honest
  // current state is FROZEN-PENDING-REVIEW until V2 (Sol) + V3 (Human) complete.
  rec.status = "FROZEN-PENDING-REVIEW";
  rec.official_solution_dependence = "NONE";
  rec.official_solution_viewed = false;
  rec.statement_en = p.en;
  rec.statement_vi = p.vi;
  rec.s0_review = {
    state: "FROZEN-PENDING-REVIEW",
    v2_english_semantic: "PENDING (Sol)",
    v3_vietnamese: "PENDING (Human)",
    human_contamination_attestation: "PENDING",
    passes_official_freeze: false,
  };
  rec.source = {
    url: OFFICIAL_URL, edition_url: EDITION_URL, fetched_at: FETCHED_AT,
    raw_page_sha256: rawPageSha, dossier_dir: `/imo2026/p${n}/official/`,
  };
  // Two-tier history: a legacy manuscript exists, but proof audit under the new
  // pipeline has not started. These are independent of the source-freeze status.
  rec.legacy_manuscript = {
    available: true,
    file: `/imo2026/p${n}/legacy/${LEGACY[n]}`,
    sha256: legacySha(n),
    created: LEGACY_CREATED,
    level: "L4-candidate (human-checkable write-up)",
    audit_state: "AUDIT-PENDING",
    label: "Independent HIVE-IMO X manuscript. Not an official IMO solution, and not independently verified under the new pipeline.",
  };
  rec.proof_audit = "NOT-STARTED";
  rec.internal_prior_solution_exposure = true;
  const base = `/imo2026/p${n}/official`;
  const artifacts = [
    ["problem_en.md", files["problem_en.md"]],
    ["problem_en.normalized.json", files["problem_en.normalized.json"]],
    ["problem_vi.reviewed.md", files["problem_vi.reviewed.md"]],
    ["source_record.json", files["source_record.json"]],
    ["contamination_ledger.json", files["contamination_ledger.json"]],
  ].map(([name, content]) => ({ name, href: `${base}/${name}`, sha256: sha256(content) }));
  rec.stages = rec.stages.map((s) =>
    s.id === "S0"
      ? { ...s, status: "FROZEN-PENDING-REVIEW",
          human: "Pending: Human V3 translation review + contamination attestation.",
          ai: "Fable froze the official statement, produced normalized EN + VI draft, source record, contamination ledger and SHA-256 manifest. Sol V2 semantic review pending. No solving.",
          artifacts }
      : s,
  );
  rec.artifact_manifest_sha256 = manifestSha;
  rec.last_updated = UPDATED_AT;
  writeFileSync(recPath, JSON.stringify(rec, null, 2) + "\n");
  console.log(`P${n}: dossier + ledger frozen (manifest ${manifestSha.slice(0, 12)}…)`);
}

// extend the status enum in the schema (idempotent)
const schemaPath = join(dataDir, "problem_record.schema.json");
const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const en = schema.properties.status.enum;
let schemaChanged = false;
for (const v of ["OFFICIAL-FROZEN", "FROZEN-PENDING-REVIEW"]) {
  if (!en.includes(v)) { en.splice(en.indexOf("NOT-STARTED") + 1, 0, v); schemaChanged = true; }
}
if (schemaChanged) {
  writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + "\n");
  console.log("schema: status enum now includes FROZEN-PENDING-REVIEW + OFFICIAL-FROZEN");
}
console.log(`\nraw page sha256: ${rawPageSha}`);
console.log("S0 freeze generation complete.");
