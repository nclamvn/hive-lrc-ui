import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { artifacts, gates, snapshot, type Locale } from "@/lib/observatory";

export function generateStaticParams() { return [{ locale: "en" }, { locale: "vi" }]; }
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);

export default async function Verification({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  const doubled = gates.filter((g) => g.verify === "double").length;
  const totalArtifacts = gates.reduce((s, g) => s + g.artifacts, 0);
  return (
    <main className="og-page">
      <p className="og-page-kicker">{t(L, "Verification", "Kiểm chứng")}</p>
      <h1 className="og-page-h1">{t(L, "Certificates & integrity", "Chứng nhận & tính toàn vẹn")}</h1>
      <p className="og-page-lede">{t(L,
        "Each gate ships two independent verifiers and a corruption suite that must reject every tampered certificate. Evidence ceiling is I2, two same-author implementations, not an independent-team audit.",
        "Mỗi gate có hai verifier độc lập và một bộ tấn công phải bác mọi chứng nhận bị sửa. Trần evidence là I2, hai bản cài cùng tác giả, chưa phải audit đội độc lập.")}</p>

      <div className="og-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 24 }}>
        {[[`${doubled}/${gates.length}`, t(L, "Gates double-checked", "Gate kiểm kép")],
          [`${totalArtifacts}`, t(L, "Artifacts", "Artifact")], ["I2", t(L, "Evidence ceiling", "Trần evidence")],
          ["40 / 44 / 48 / 52", t(L, "Corruption D14-D17", "Tấn công D14-D17")]].map(([v, l]) => (
          <div className="og-tile" key={l} style={{ cursor: "default" }}>
            <div style={{ fontSize: 21, fontWeight: 650, letterSpacing: "-0.02em" }}>{v}</div>
            <div className="og-tile-meta" style={{ marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div className="og-sec">{t(L, "Published artifacts", "Artifact công bố")}</div>
      <div className="og-grid">
        {artifacts.map((a) => (
          <div key={a.artifact_id} className="og-tile" style={{ cursor: "default" }}>
            <div className="og-tile-top"><span className="og-tile-id">{a.artifact_id}</span><span className="og-chip accent">{a.verification_status.replace(/_/g, " ")}</span></div>
            <div className="og-tile-title">{a.title}</div>
            <div className="og-tile-meta"><span>{a.type}</span><span>· {a.source_gate}</span><span>· {t(L, "corruption", "tấn công")}: {a.corruption}</span><span>· {t(L, "access", "truy cập")}: {a.download_policy.replace(/_/g, " ")}</span></div>
          </div>
        ))}
      </div>

      <p className="og-audit og-tech" style={{ marginTop: 24 }}>{t(L, "Public snapshot hash", "Hash snapshot công khai")}: {snapshot.snapshot_hash}{"\n"}{t(L, "This portal reads only a governance-scanned projection, no private path, log or credential is exposed.", "Cổng này chỉ đọc một projection đã quét governance, không lộ path, log hay credential nội bộ.")}</p>
    </main>
  );
}
