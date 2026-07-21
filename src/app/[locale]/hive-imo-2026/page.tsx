import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n";
import {
  problemsByDay, ledgerTotals,
  legacyManuscriptCount, officialReviewedCount, independentlyAuditedCount,
  STAGE_IDS,
} from "@/lib/imo/ledger";
import {
  ROLES, SEPARATION_PRINCIPLE, STAGE_NAMES, t, type Locale,
} from "@/lib/imo/copy";
import { ProblemCard } from "@/components/hive-imo/ProblemCard";

export const metadata: Metadata = {
  title: "HIVE-IMO X — Six Problems, One Verifiable Human–AI Journey",
  description: "A public record of a Human × AI attempt at all six IMO 2026 problems, with independent verification gates.",
};

export default async function HiveImoOverview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;

  const totals = ledgerTotals();
  const day1 = problemsByDay(1);
  const day2 = problemsByDay(2);
  // "complete" means an independently-audited PROOF, not merely an advanced
  // source-pipeline status. Currently 0/6.
  const done = independentlyAuditedCount();
  const unlocked = done === 6;
  const tiers = [
    { v: `${legacyManuscriptCount()}/6`, en: "Legacy solution manuscripts", vi: "Bản thảo lời giải sẵn có",
      note_en: "written earlier; not independently verified", note_vi: "đã viết trước; chưa kiểm chứng độc lập", tone: "have" },
    { v: `${officialReviewedCount()}/6`, en: "Official statements fully reviewed", vi: "Đề chính thức đã duyệt xong",
      note_en: "S0 source gate, pending V2/V3", note_vi: "gate nguồn S0, chờ V2/V3", tone: "wip" },
    { v: `${independentlyAuditedCount()}/6`, en: "Independently audited proofs", vi: "Chứng minh audit độc lập",
      note_en: "the only figure that counts as complete", note_vi: "chỉ số duy nhất được tính là hoàn thành", tone: "gate" },
  ];

  const hours = (min: number) => (min > 0 ? `${(min / 60).toFixed(1)}h` : t(L, "Not yet logged", "Chưa ghi nhận"));

  return (
    <main>
      {/* hero */}
      <section className="hi-hero">
        <div className="hi-wrap">
          <div className="hi-eyebrow">HIVE RESEARCH · IMO 2026 · HUMAN × AI</div>
          <h1 className="hi-hero-title">
            {t(L, "Six problems. One verifiable Human–AI journey.",
                  "Sáu bài toán. Một hành trình Human × AI có thể kiểm chứng.")}
          </h1>
          <p className="hi-hero-sub">
            {t(L,
              "An open record of how a human and AI read, attempt, fail, repair and verify all six IMO 2026 problems.",
              "Một hồ sơ mở về cách con người và AI cùng đọc, thử, sai, sửa và kiểm chứng trọn bộ sáu bài toán IMO 2026.")}
          </p>
          <p className="hi-hero-body">
            {t(L,
              "The IMO does not only test finding an answer. It tests seeing structure, choosing the right lemma, and writing a proof with no hidden steps. HIVE-IMO X records the whole process — blind reading, wrong routes, counterexamples and proof candidates — through to independent verification.",
              "IMO không chỉ kiểm tra việc tìm ra đáp án. Nó kiểm tra khả năng nhìn thấy cấu trúc, chọn đúng bổ đề và viết một chứng minh không có chỗ ẩn. HIVE-IMO X ghi lại toàn bộ quá trình — đọc mù, những hướng sai, phản ví dụ và proof candidate — cho đến kiểm chứng độc lập.")}
          </p>
          <p className="hi-hero-note">
            {t(L,
              "This is not an “AI solved mathematics” showcase. It is a record of how human judgment, machine search, and verification work without collapsing into one another.",
              "Đây không phải màn trình diễn “AI giải toán”. Đây là hồ sơ về cách con người giữ quyền phán đoán, AI mở rộng không gian tìm kiếm và verifier quyết định điều gì được phép gọi là đúng.")}
          </p>

          <div className="hi-cta-row">
            <a className="hi-btn primary" href="#dashboard">{t(L, "See all six problems", "Xem tiến độ 6 bài")}</a>
            <a className="hi-btn" href="#process">{t(L, "Read the HIVE process", "Đọc quy trình HIVE")}</a>
            <a className="hi-btn" href="#dashboard">{t(L, "Artifact ledger", "Xem artifact ledger")}</a>
            <span className="hi-btn" aria-disabled="true" title={t(L, "Available once a dossier is published", "Có khi đã công bố dossier")}>
              {t(L, "Download proof dossier", "Tải proof dossier")}
            </span>
          </div>

          {/* mandatory status block (brief §2) */}
          <div className="hi-statusblock">
            <dl>
              <div><dt>PROJECT</dt><dd>HIVE-IMO X</dd></div>
              <div><dt>TARGET</dt><dd>{legacyManuscriptCount()}/6 manuscripts · {independentlyAuditedCount()}/6 audited</dd></div>
              <div><dt>{t(L, "HUMAN OWNER", "HUMAN OWNER")}</dt><dd>Lâm Nguyễn</dd></div>
              <div><dt>AI CONTRACTOR</dt><dd>Sol — ChatGPT 5.6 Thinking</dd></div>
              <div><dt>AI BUILDER</dt><dd>Fable — Claude Code</dd></div>
              <div><dt>OFFICIAL-SOLUTION DEPENDENCE</dt><dd>{t(L, "shown per problem", "hiển thị theo từng bài")}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* dashboard */}
      <section className="hi-section" id="dashboard">
        <div className="hi-wrap">
          <div className="hi-sec-head">
            <div className="hi-sec-kicker">{t(L, "Live dashboard", "Bảng theo dõi")}</div>
            <h2 className="hi-sec-title">{t(L, "Six problems, two exam days", "Sáu bài toán, hai ngày thi")}</h2>
            <p className="hi-sec-lede">
              {t(L,
                "IMO 2026 is the 67th IMO, held in Shanghai, 10–21 July 2026. Exam days are 15 and 16 July, three problems each. A problem counts as complete only at VERIFIED-INDEPENDENT or beyond.",
                "IMO 2026 là kỳ thứ 67, tổ chức tại Thượng Hải 10–21/07/2026. Hai ngày thi là 15 và 16/07, mỗi ngày ba bài. Một bài chỉ được tính hoàn thành từ mức VERIFIED-INDEPENDENT trở lên.")}
            </p>
          </div>

          <div className="hi-tiers">
            {tiers.map((tr) => (
              <div className={`hi-tier ${tr.tone}`} key={tr.en}>
                <div className="tv">{tr.v}</div>
                <div className="tl">{locale === "vi" ? tr.vi : tr.en}</div>
                <div className="tn">{locale === "vi" ? tr.note_vi : tr.note_en}</div>
              </div>
            ))}
          </div>
          <p className="hi-tier-caption">
            {t(L,
              "These three figures are different. Six complete solution manuscripts already exist from earlier work; none has yet passed independent audit under this public pipeline.",
              "Ba con số này khác nhau. Đã có sáu bản thảo lời giải hoàn chỉnh từ trước; chưa bản nào vượt audit độc lập theo pipeline công khai này.")}
          </p>

          <div className="hi-day-label">{t(L, "Day 1", "Ngày 1")} <span className="date">· 15 Jul 2026 · P1 · P2 · P3</span></div>
          <div className="hi-grid">
            {day1.map((p) => <ProblemCard key={p.problem_id} p={p} locale={L} />)}
          </div>

          <div className="hi-day-label">{t(L, "Day 2", "Ngày 2")} <span className="date">· 16 Jul 2026 · P4 · P5 · P6</span></div>
          <div className="hi-grid">
            {day2.map((p) => <ProblemCard key={p.problem_id} p={p} locale={L} />)}
          </div>
        </div>
      </section>

      {/* honest index metrics */}
      <section className="hi-section tight">
        <div className="hi-wrap">
          <div className="hi-metrics">
            <div className="hi-metric">
              <div className="mv">{done}/6</div>
              <div className="ml">{t(L, "Independently audited proofs", "Chứng minh audit độc lập")}</div>
              <div className="mnote">{t(L, "the only 'complete' figure", "chỉ số 'hoàn thành' duy nhất")}</div>
            </div>
            <div className="hi-metric">
              <div className="mv">{totals.proofsRejected}</div>
              <div className="ml">{t(L, "Proof candidates rejected", "Proof ứng viên bị bác")}</div>
            </div>
            <div className="hi-metric">
              <div className="mv">{totals.counterexamples}</div>
              <div className="ml">{t(L, "Counterexamples found", "Phản ví dụ tìm được")}</div>
            </div>
            <div className="hi-metric">
              <div className="mv">{totals.lemmasRetained}</div>
              <div className="ml">{t(L, "Lemmas retained", "Bổ đề giữ lại")}</div>
            </div>
            <div className="hi-metric">
              <div className="mv">{hours(totals.humanMinutes)}</div>
              <div className="ml">{t(L, "Human time", "Thời gian Human")}</div>
            </div>
            <div className="hi-metric">
              <div className="mv">{hours(totals.aiComputeMinutes)}</div>
              <div className="ml">{t(L, "AI compute time", "Thời gian AI compute")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* process */}
      <section className="hi-section" id="process">
        <div className="hi-wrap">
          <div className="hi-sec-head">
            <div className="hi-sec-kicker">{t(L, "The method", "Phương pháp")}</div>
            <h2 className="hi-sec-title">{t(L, "Every problem passes through fifteen stages", "Mỗi bài đi qua mười lăm bước")}</h2>
            <p className="hi-sec-lede">
              {t(L,
                "The pipeline separates reading, attempting, verifying and comparing so no single agent can propose and bless its own answer.",
                "Quy trình tách rõ đọc, thử, kiểm và so sánh để không agent nào tự đề xuất rồi tự chấp nhận câu trả lời của mình.")}
            </p>
          </div>
          <div className="hi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {STAGE_IDS.map((id) => {
              const n = STAGE_NAMES[id];
              return (
                <div className="hi-role" key={id} style={{ padding: "18px 20px" }}>
                  <div className="hi-role-role" style={{ fontFamily: "var(--hi-mono)", color: "var(--hi-faint)" }}>{id}</div>
                  <div style={{ fontFamily: "var(--hi-serif)", fontSize: 17, fontWeight: 500, marginTop: 2 }}>
                    {locale === "vi" ? n.vi : n.en}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* operating model */}
      <section className="hi-section" id="roles">
        <div className="hi-wrap">
          <div className="hi-sec-head">
            <div className="hi-sec-kicker">{t(L, "Operating model", "Mô hình vận hành")}</div>
            <h2 className="hi-sec-title">{t(L, "Three roles, kept separate on purpose", "Ba vai trò, cố ý tách rời")}</h2>
          </div>
          <div className="hi-roles">
            {([ROLES.human, ROLES.sol, ROLES.fable]).map((r) => (
              <div className="hi-role" key={r.name}>
                <div className="hi-role-name">{r.name}</div>
                <div className="hi-role-role">{locale === "vi" ? r.role.vi : r.role.en}</div>
                <ul>
                  {(locale === "vi" ? r.duties.vi : r.duties.en).map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="hi-principle">
            {locale === "vi" ? SEPARATION_PRINCIPLE.vi : SEPARATION_PRINCIPLE.en}
          </div>
        </div>
      </section>

      {/* locked 6/6 summary */}
      <section className="hi-wrap" id="summary">
        <div className="hi-locked">
          <svg className="hi-locked-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="hi-locked-t">
            {unlocked
              ? t(L, "6/6 summary is open", "Khối tổng kết 6/6 đã mở")
              : t(L, "The 6/6 summary is locked", "Khối tổng kết 6/6 đang khóa")}
          </div>
          <p className="hi-locked-b">
            {unlocked
              ? t(L, "All six problems have reached at least independent verification.", "Cả sáu bài đã đạt tối thiểu kiểm chứng độc lập.")
              : t(L,
                  "It unlocks only when all six problems reach at least VERIFIED-INDEPENDENT. The project will not display “6/6 solved” before then.",
                  "Chỉ mở khi cả sáu bài đạt tối thiểu VERIFIED-INDEPENDENT. Dự án sẽ không hiển thị “6/6 solved” trước thời điểm đó.")}
          </p>
          <div className="hi-locked-meter">
            <span className="hi-locked-bar"><i style={{ width: `${(done / 6) * 100}%` }} /></span>
            <span>{done}/6</span>
          </div>
        </div>
      </section>
    </main>
  );
}
