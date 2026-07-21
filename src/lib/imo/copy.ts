// HIVE-IMO X — bilingual copy + label registries.
// All display strings live here so en/vi stay parallel and the components
// stay presentational. Wording is taken verbatim from the approved brief.

import type {
  ContributionLevel,
  EvidenceClass,
  OfficialDependence,
  StageId,
  Status,
} from "@/lib/imo/ledger";

export type Locale = "en" | "vi";

export const t = (locale: Locale, en: string, vi: string) => (locale === "vi" ? vi : en);

export const STAGE_NAMES: Record<StageId, { en: string; vi: string }> = {
  S0: { en: "Official problem freeze", vi: "Khóa đề chính thức" },
  S1: { en: "Human blind read", vi: "Human đọc mù" },
  S2: { en: "AI independent read", vi: "AI đọc độc lập" },
  S3: { en: "Contrastive merge", vi: "Hợp nhất đối chiếu" },
  S4: { en: "Formal decomposition", vi: "Phân rã hình thức" },
  S5: { en: "Small-domain reconnaissance", vi: "Trinh sát miền nhỏ" },
  S6: { en: "Route tournament", vi: "Giải đấu hướng đi" },
  S7: { en: "Lemma forge", vi: "Rèn bổ đề" },
  S8: { en: "Candidate proof assembly", vi: "Ghép proof ứng viên" },
  S9: { en: "Adversarial review", vi: "Phản biện đối kháng" },
  S10: { en: "Independent reconstruction", vi: "Tái dựng độc lập" },
  S11: { en: "Human proof rewrite", vi: "Human viết lại chứng minh" },
  S12: { en: "Independent / formal verification", vi: "Kiểm chứng độc lập / hình thức" },
  S13: { en: "Official-solution comparison", vi: "So sánh lời giải chính thức" },
  S14: { en: "Publication and postmortem", vi: "Công bố và postmortem" },
};

// Human-facing status labels. The pipeline enum stays canonical (see ledger.ts);
// this only affects display.
export const STATUS_LABELS: Record<Status, { en: string; vi: string }> = {
  "NOT-STARTED": { en: "Not started", vi: "Chưa bắt đầu" },
  "FROZEN-PENDING-REVIEW": { en: "Frozen · pending review", vi: "Đã khóa · chờ kiểm" },
  "OFFICIAL-FROZEN": { en: "Official statement frozen", vi: "Đã khóa đề chính thức" },
  "HUMAN-READ": { en: "Human read", vi: "Đã đọc (Human)" },
  "AI-READ": { en: "AI read", vi: "Đã đọc (AI)" },
  "DECOMPOSED": { en: "Decomposed", vi: "Đã phân rã" },
  "CANDIDATE-LEMMA": { en: "Candidate lemma", vi: "Bổ đề ứng viên" },
  "CANDIDATE-PROOF": { en: "Candidate proof", vi: "Proof ứng viên" },
  "COUNTEREXAMPLE-FOUND": { en: "Counterexample found", vi: "Tìm được phản ví dụ" },
  "REPAIR-IN-PROGRESS": { en: "Repair in progress", vi: "Đang sửa" },
  "VERIFIED-INTERNAL": { en: "Verified (internal)", vi: "Kiểm chứng nội bộ" },
  "VERIFIED-INDEPENDENT": { en: "Verified (independent)", vi: "Kiểm chứng độc lập" },
  "FORMALIZED": { en: "Formalized", vi: "Đã hình thức hóa" },
  "PUBLISHED": { en: "Published", vi: "Đã công bố" },
};

// Confidence vocabulary — brief §2 bans fake percentages; use these words only.
export const EVIDENCE_LABELS: Record<EvidenceClass, { en: string; vi: string }> = {
  I0: { en: "Unscoped", vi: "Chưa định phạm vi" },
  I1: { en: "Exploratory", vi: "Thăm dò" },
  I2: { en: "Promising", vi: "Triển vọng" },
  I3: { en: "Internally verified", vi: "Kiểm chứng nội bộ" },
  I4: { en: "Independently verified", vi: "Kiểm chứng độc lập" },
};

export const DEPENDENCE_LABELS: Record<OfficialDependence, { en: string; vi: string }> = {
  "NONE": { en: "None", vi: "Không" },
  "POST-HOC-COMPARISON": { en: "Post-hoc comparison only", vi: "Chỉ so sánh sau khi freeze" },
  "PARTIAL": { en: "Partial", vi: "Một phần" },
  "YES": { en: "Yes", vi: "Có" },
};

export const CONTRIBUTION_LABELS: Record<ContributionLevel, { en: string; vi: string }> = {
  LEAD: { en: "Lead", vi: "Chủ trì" },
  "CO-LEAD": { en: "Co-lead", vi: "Đồng chủ trì" },
  SUPPORT: { en: "Support", vi: "Hỗ trợ" },
  VERIFY: { en: "Verify", vi: "Kiểm chứng" },
  NONE: { en: "—", vi: "—" },
};

// Rows of the contribution matrix (brief §6).
export const MATRIX_ROWS: { key: string; en: string; vi: string }[] = [
  { key: "problem_interpretation", en: "Problem interpretation", vi: "Diễn giải đề" },
  { key: "core_idea", en: "Core idea", vi: "Ý tưởng cốt lõi" },
  { key: "lemma_discovery", en: "Lemma discovery", vi: "Phát hiện bổ đề" },
  { key: "counterexample_search", en: "Counterexample search", vi: "Tìm phản ví dụ" },
  { key: "proof_writing", en: "Proof writing", vi: "Viết chứng minh" },
  { key: "formal_checking", en: "Formal checking", vi: "Kiểm hình thức" },
  { key: "final_approval", en: "Final approval", vi: "Phê duyệt cuối" },
];

export const MATRIX_COLS: { key: "human" | "sol" | "fable" | "independent"; en: string; vi: string }[] = [
  { key: "human", en: "Human", vi: "Human" },
  { key: "sol", en: "Sol", vi: "Sol" },
  { key: "fable", en: "Fable", vi: "Fable" },
  { key: "independent", en: "Independent verifier", vi: "Verifier độc lập" },
];

export const ROLES = {
  human: {
    name: "Lâm Nguyễn",
    role: { en: "Human Owner / PI", vi: "Human Owner / PI" },
    duties: {
      en: ["Choose research direction", "Hold intuition and the natural standard of proof", "Approve gates", "Control claims", "Own publication"],
      vi: ["Chọn hướng nghiên cứu", "Giữ trực giác và tiêu chuẩn tự nhiên của chứng minh", "Phê duyệt gate", "Kiểm soát claim", "Chịu trách nhiệm công bố"],
    },
  },
  sol: {
    name: "Sol",
    role: { en: "AI Contractor · ChatGPT 5.6 Thinking", vi: "AI Contractor · ChatGPT 5.6 Thinking" },
    duties: {
      en: ["Formalize problems", "Map the theorem landscape", "Design gates", "Red-team proofs", "Surface hidden assumptions", "Issue verdicts"],
      vi: ["Formalize đề", "Lập bản đồ định lý", "Thiết kế gate", "Phản biện proof", "Tìm giả định ẩn", "Phát hành verdict"],
    },
  },
  fable: {
    name: "Fable",
    role: { en: "AI Builder · Claude Code", vi: "AI Builder · Claude Code" },
    duties: {
      en: ["Implement search / verifier", "Run tests and counterexample search", "Produce artifacts", "Update the website from the approved ledger"],
      vi: ["Triển khai search / verifier", "Chạy test và tìm phản ví dụ", "Tạo artifact", "Cập nhật website từ ledger đã duyệt"],
    },
  },
};

export const SEPARATION_PRINCIPLE = {
  en: "No single agent may propose, implement, verify, and declare success for the same claim.",
  vi: "Không agent nào được tự đề xuất, tự triển khai, tự kiểm và tự tuyên bố thành công cho cùng một claim.",
};
