import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, LOCALES } from "@/i18n";
import { allProblems, problemBySlug, isComplete } from "@/lib/imo/ledger";
import {
  DEPENDENCE_LABELS, EVIDENCE_LABELS, STATUS_LABELS, t, type Locale,
} from "@/lib/imo/copy";
import { StatusBadge } from "@/components/hive-imo/StatusBadge";
import { StageTimeline } from "@/components/hive-imo/StageTimeline";
import { ContributionMatrix } from "@/components/hive-imo/ContributionMatrix";
import { ArtifactList } from "@/components/hive-imo/ArtifactList";
import { Markdown } from "@/components/hive-imo/Markdown";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    allProblems().map((p) => ({ locale, problem: `problem-${p.number}` })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; problem: string }> }): Promise<Metadata> {
  const { problem } = await params;
  const p = problemBySlug(problem);
  return { title: p ? `HIVE-IMO X - Problem ${p.number}` : "HIVE-IMO X" };
}

function Block({ id, heading, lede, children }: { id?: string; heading: string; lede?: string; children: React.ReactNode }) {
  return (
    <section className="hi-block" id={id}>
      <h2 className="hi-block-h">{heading}</h2>
      {lede && <p className="hi-block-lede">{lede}</p>}
      {children}
    </section>
  );
}

export default async function ProblemDetail({ params }: { params: Promise<{ locale: string; problem: string }> }) {
  const { locale, problem } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  const p = problemBySlug(problem);
  if (!p) notFound();

  const ev = EVIDENCE_LABELS[p.evidence_class];
  const dep = DEPENDENCE_LABELS[p.official_solution_dependence];
  const viewed = p.official_solution_viewed === true;
  const domain = p.domain.length ? p.domain.join(" · ") : t(L, "domain pending", "chưa xác định lĩnh vực");

  const empty = (en: string, vi: string) => <div className="hi-empty">{t(L, en, vi)}</div>;

  return (
    <main>
      <div className="hi-article">
        {/* 1. header + status */}
        <div className="hi-detail-head">
          <Link className="hi-back" href={`/${L}/hive-imo-2026`}>← {t(L, "All problems", "Tất cả các bài")}</Link>
          <h1 className="hi-detail-title">
            {t(L, "IMO 2026 · Problem", "IMO 2026 · Bài")} {p.number}
          </h1>
          <div className="hi-detail-meta">
            <StatusBadge status={p.status} locale={L} />
            <span className="dot">·</span>
            <span>{t(L, "Day", "Ngày")} {p.day}</span>
            <span className="dot">·</span>
            <span>{domain}</span>
            <span className="dot">·</span>
            <span>{t(L, "Evidence", "Bằng chứng")} {p.evidence_class} - {locale === "vi" ? ev.vi : ev.en}</span>
          </div>
          <div className="hi-detail-meta">
            <span>{t(L, "Official-solution dependence:", "Phụ thuộc lời giải chính thức:")} <b>{locale === "vi" ? dep.vi : dep.en}</b></span>
            <span className="dot">·</span>
            <span>{t(L, "Official solution viewed:", "Đã xem lời giải chính thức:")} <b>{viewed ? t(L, "YES", "CÓ") : t(L, "NO", "CHƯA")}</b></span>
          </div>
          <div className="hi-detail-meta">
            <span>{t(L, "Proof audit:", "Audit chứng minh:")} <b>{p.proof_audit ?? "NOT-STARTED"}</b></span>
            <span className="dot">·</span>
            <span>{t(L, "Internal prior-solution exposure:", "Đã tiếp xúc lời giải nội bộ:")} <b>{p.internal_prior_solution_exposure ? t(L, "YES", "CÓ") : t(L, "NO", "KHÔNG")}</b></span>
          </div>
        </div>

        {/* legacy manuscript (pre-existing solution write-up) */}
        {p.legacy_manuscript?.available && (
          <Block heading={t(L, "Legacy solution manuscript", "Bản thảo lời giải sẵn có")}
                 lede={t(L, "A complete solution write-up produced earlier in the project. Preserved here in full; not an official IMO solution and not yet independently audited.",
                            "Một bản thảo lời giải hoàn chỉnh được tạo trước đó trong dự án. Giữ nguyên tại đây; không phải lời giải chính thức của IMO và chưa được audit độc lập.")}>
            <div className="hi-legacy">
              <div className="hi-legacy-top">
                <span className="hi-legacy-t">{p.legacy_manuscript.file.split("/").pop()}</span>
                <a className="hi-dl" href={p.legacy_manuscript.file} target="_blank" rel="noopener noreferrer" download>
                  {t(L, "Download PDF", "Tải PDF")}
                </a>
              </div>
              <div className="hi-legacy-meta">
                <span>{t(L, "created", "tạo")} {p.legacy_manuscript.created}</span>
                <span>{t(L, "level", "mức")}: {p.legacy_manuscript.level}</span>
                <span>{t(L, "audit", "audit")}: {p.legacy_manuscript.audit_state}</span>
                <span title={p.legacy_manuscript.sha256}>sha256:{p.legacy_manuscript.sha256.slice(0, 12)}…</span>
              </div>
              <p className="hi-legacy-note">{p.legacy_manuscript.label}</p>
            </div>
          </Block>
        )}

        {/* 2. official problem */}
        <Block heading={t(L, "Official problem", "Đề chính thức")}>
          {p.statement_en ? (
            <>
              {p.s0_review && !p.s0_review.passes_official_freeze && (
                <div className="hi-review-banner">
                  {t(L,
                    "Statement captured from the official source but not yet passed. Independent English semantic review (Sol, V2) and Human Vietnamese review (V3) are pending; the gate is not yet PASS-OFFICIAL-FREEZE.",
                    "Đề đã được lấy từ nguồn chính thức nhưng CHƯA được duyệt. Kiểm tra ngữ nghĩa tiếng Anh độc lập (Sol, V2) và kiểm tra bản dịch Việt của Human (V3) đang chờ; gate chưa đạt PASS-OFFICIAL-FREEZE.")}
                </div>
              )}
              <div className="hi-statement-frame">
                <Markdown>{p.statement_en}</Markdown>
              </div>
              <div className="hi-provenance">
                <a href={p.official_source} target="_blank" rel="noopener noreferrer">{t(L, "official source ↗", "nguồn chính thức ↗")}</a>
                {p.source && <span>frozen {p.source.fetched_at.slice(0, 10)}</span>}
                {p.source && <span title={`raw page sha256: ${p.source.raw_page_sha256}`}>sha256:{p.source.raw_page_sha256.slice(0, 10)}…</span>}
              </div>
            </>
          ) : (
            empty(
              "The official problem text is not frozen yet (stage S0 pending).",
              "Đề chính thức chưa được freeze (bước S0 chưa chạy).")
          )}
        </Block>

        {/* 3. vietnamese translation */}
        <Block heading={t(L, "Vietnamese translation", "Bản dịch tiếng Việt")}>
          {p.statement_vi ? (
            <>
              <p className="hi-vi-note">
                {t(L, "Faithful literal draft by Fable, pending Human review (proper names kept in original form).",
                      "Bản dịch sát nghĩa do Fable soạn, chờ Human duyệt (tên riêng giữ nguyên dạng gốc).")}
              </p>
              <div className="hi-statement-frame">
                <Markdown>{p.statement_vi}</Markdown>
              </div>
            </>
          ) : (
            empty("Available after S0 freeze, preserving the exact quantifiers and conditions of the original.",
                  "Có sau khi freeze S0, giữ đúng lượng từ và điều kiện của bản gốc.")
          )}
        </Block>

        {/* 4. what it asks */}
        <Block heading={t(L, "What the problem asks", "Bài toán hỏi gì")}>
          {empty("A short plain-language explanation is written during S1–S3, after independent human and AI reads. S0 freezes the statement only - no interpretation yet.",
                 "Phần giải thích ngắn gọn được viết trong S1–S3, sau khi Human và AI đọc độc lập. S0 chỉ khóa đề, chưa diễn giải.")}
        </Block>

        {/* 5. contribution matrix */}
        <Block heading={t(L, "Human × AI contribution matrix", "Ma trận đóng góp Human × AI")}
               lede={t(L, "Attribution per stage. Final approval is always human-led and verified independently.",
                          "Ghi đóng góp theo từng bước. Phê duyệt cuối luôn do Human chủ trì và được kiểm chứng độc lập.")}>
          <ContributionMatrix p={p} locale={L} />
        </Block>

        {/* reconciliation / audit preparation (S0-R) */}
        {p.reconciliation && (
          <Block heading={t(L, "Audit preparation (S0-R)", "Chuẩn bị audit (S0-R)")}
                 lede={t(L, "The manuscript has been reconciled into a verifier-ready dossier: statement binding, section map, and a proof-obligation skeleton. No obligation has been verified.",
                            "Bản thảo đã được tái nối thành hồ sơ sẵn sàng cho verifier: gắn đề, section map, và bộ khung nghĩa vụ chứng minh. Chưa nghĩa vụ nào được kiểm chứng.")}>
            <div className="hi-legacy">
              <div className="hi-legacy-meta" style={{ marginTop: 0 }}>
                <span>{t(L, "state", "trạng thái")}: {p.reconciliation.state}</span>
                <span>{t(L, "statement", "đề")}: {p.reconciliation.statement_match}</span>
                <span>{t(L, "proof obligations", "nghĩa vụ chứng minh")}: {p.reconciliation.obligations} ({p.reconciliation.load_bearing} {t(L, "load-bearing", "tải trọng cao")})</span>
                <span>{t(L, "audited", "đã audit")}: 0/{p.reconciliation.obligations}</span>
              </div>
              <p className="hi-legacy-note">
                {t(L, "Every obligation is marked CLAIMED (asserted by the manuscript), never VERIFIED. Independent audit by an unexposed verifier has not started.",
                      "Mọi nghĩa vụ được đánh dấu CLAIMED (do bản thảo khẳng định), không phải VERIFIED. Audit độc lập bởi verifier chưa bị nhiễm chưa bắt đầu.")}
              </p>
              <div className="hi-legacy-meta">
                <a href={`${p.reconciliation.audit_dir}proof_obligations.json`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--hi-accent)" }}>proof_obligations.json ↗</a>
                <a href={`${p.reconciliation.audit_dir}verifier_input_manifest.json`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--hi-accent)" }}>verifier_input_manifest.json ↗</a>
                <span title={p.reconciliation.record_sha256}>sha256:{p.reconciliation.record_sha256.slice(0, 12)}…</span>
              </div>
            </div>
          </Block>
        )}

        {/* 6. timeline */}
        <Block heading={t(L, "Timeline · S0–S14", "Timeline · S0–S14")}>
          <StageTimeline p={p} locale={L} />
        </Block>

        {/* 7. route map */}
        <Block heading={t(L, "Route map", "Bản đồ hướng đi")}
               lede={t(L, "Up to three main routes survive the tournament at S6.", "Tối đa ba hướng chính sống sót qua giải đấu ở S6.")}>
          {empty("No routes proposed yet.", "Chưa có hướng đi nào được đề xuất.")}
        </Block>

        {/* 8. failed attempts */}
        <Block heading={t(L, "Failed attempts", "Những hướng đã thất bại")}
               lede={t(L, "Failed routes and rejected proofs are kept permanently, never deleted.",
                          "Các hướng thất bại và proof bị bác được giữ vĩnh viễn, không bao giờ xóa.")}>
          {empty("None recorded yet.", "Chưa ghi nhận.")}
        </Block>

        {/* 9. key lemmas */}
        <Block heading={t(L, "Key lemmas", "Bổ đề chính")}>
          {empty("Lemmas appear here once forged at S7, each with an exact statement and an evidence class.",
                 "Bổ đề xuất hiện tại đây khi được rèn ở S7, mỗi bổ đề có phát biểu chính xác và một evidence class.")}
        </Block>

        {/* 10 & 11. proofs */}
        <Block heading={t(L, "Proof - compact", "Chứng minh - bản gọn")}>
          {empty("Written at S11 in natural olympiad style, scorable 0–7 per step. Not yet available.",
                 "Được viết ở S11 theo văn phong olympiad tự nhiên, chấm được 0–7 mỗi bước. Chưa có.")}
        </Block>
        <Block heading={t(L, "Proof - annotated", "Chứng minh - bản chú giải")}>
          {empty("The annotated proof with justifications and dependencies is not yet available.",
                 "Bản chú giải với lý do và phụ thuộc chưa có.")}
        </Block>

        {/* 12. independent verifier */}
        <Block heading={t(L, "Independent verification", "Kiểm chứng độc lập")}
               lede={t(L, "Required before the status VERIFIED-INDEPENDENT may be shown.",
                          "Bắt buộc trước khi được hiển thị trạng thái VERIFIED-INDEPENDENT.")}>
          {isComplete(p)
            ? empty("Verification report is attached in the artifacts below.", "Báo cáo kiểm chứng đính kèm trong phần artifact bên dưới.")
            : empty("No independent verification has been performed. Status will not reach VERIFIED-INDEPENDENT until an olympiad expert, an independent model family, or a formal proof (Lean/Isabelle/Coq) confirms the proof.",
                    "Chưa có kiểm chứng độc lập. Trạng thái sẽ không đạt VERIFIED-INDEPENDENT cho tới khi một chuyên gia olympiad, một model family độc lập, hoặc chứng minh hình thức (Lean/Isabelle/Coq) xác nhận.")}
        </Block>

        {/* 13. official comparison */}
        <Block heading={t(L, "Official-solution comparison", "So sánh lời giải chính thức")}>
          <div className="hi-empty">
            <div style={{ fontFamily: "var(--hi-mono)", fontSize: 12.5, color: "var(--hi-ink)" }}>
              {t(L, "Official solution viewed after proof freeze:", "Xem lời giải chính thức sau khi freeze proof:")} <b>{viewed ? "YES" : "NO"}</b><br />
              {t(L, "Official solution dependence:", "Phụ thuộc lời giải chính thức:")} <b>{p.official_solution_dependence}</b>
            </div>
            <p style={{ marginTop: 10, marginBottom: 0 }}>
              {t(L, "A full comparison (core idea, length, naturalness, differences) runs at S13, only after the proof is frozen.",
                    "So sánh đầy đủ (ý tưởng cốt lõi, độ dài, tính tự nhiên, khác biệt) chạy ở S13, chỉ sau khi proof đã freeze.")}
            </p>
          </div>
        </Block>

        {/* 14. artifacts */}
        <Block heading={t(L, "Artifact downloads", "Tải artifact")}
               lede={t(L, "Every file is published with a SHA-256 checksum.", "Mọi tệp được công bố kèm checksum SHA-256.")}>
          <ArtifactList
            artifacts={p.stages.flatMap((s) => s.artifacts ?? [])}
            locale={L}
          />
          {p.artifact_manifest_sha256 && (
            <p style={{ fontFamily: "var(--hi-mono)", fontSize: 11.5, color: "var(--hi-faint)", marginTop: 12 }}>
              MANIFEST sha256: {p.artifact_manifest_sha256}
            </p>
          )}
        </Block>

        {/* 15. revision history */}
        <Block heading={t(L, "Revision history", "Lịch sử thay đổi")}>
          <ol className="hi-timeline">
            <li className="hi-tl">
              <div className="hi-tl-top">
                <span className="hi-tl-id">{new Date(p.last_updated).toLocaleDateString(L === "vi" ? "vi-VN" : "en-GB")}</span>
                <span className="hi-tl-name">{t(L, "Record initialized", "Khởi tạo record")}</span>
              </div>
              <div className="hi-tl-body">
                {t(L, `Ledger created at status ${p.status}. No mathematical progress recorded yet.`,
                      `Ledger được tạo ở trạng thái ${p.status}. Chưa ghi nhận tiến độ toán học.`)}
              </div>
            </li>
          </ol>
        </Block>
      </div>
    </main>
  );
}
