import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { type Locale } from "@/lib/observatory";

export function generateStaticParams() { return [{ locale: "en" }, { locale: "vi" }]; }
const t = (l: Locale, en: string, vi: string) => (l === "vi" ? vi : en);

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  return (
    <main className="og-page">
      <div className="og-about">
        <div className="og-detail">
          <p className="og-page-kicker">{t(L, "About", "Giới thiệu")}</p>
          <h1 className="og-page-h1">{t(L, "What this is", "Đây là gì")}</h1>
          <p>{t(L,
            "The HIVE-LRC Observatory is a public projection of an ongoing research program attacking the Lonely Runner Conjecture for 13 nonzero speeds (14 runners). It is a curated, reviewed view, not a live feed of an internal database.",
            "HIVE-LRC Observatory là projection công khai của một chương trình nghiên cứu đang tiến hành tấn công Giả thuyết Người chạy cô đơn cho 13 vận tốc khác 0 (14 người chạy). Đây là khung nhìn được biên tập, đã duyệt, không phải luồng trực tiếp từ cơ sở dữ liệu nội bộ.")}</p>

          <h2>{t(L, "Roles", "Vai trò")}</h2>
          <p>{t(L,
            "The program runs as a Human-AI collaboration: an Owner/PI sets direction and approves publication, a Contractor authors gate specifications and reviews results, and a Builder executes the mathematics, verifiers and corruption suites.",
            "Chương trình vận hành như hợp tác Người-AI: một Owner/PI định hướng và duyệt công bố, một Contractor soạn đặc tả gate và review kết quả, một Builder thực thi toán, verifier và bộ tấn công.")}</p>

          <h2>{t(L, "How to read it honestly", "Cách đọc trung thực")}</h2>
          <p>{t(L,
            "Statuses are precise and never inflated. 'Proved' means an internal proof, 'validated' means an exact finite computation, 'supported' and 'provisional' are weaker. The evidence ceiling is I2: two same-author implementations, which is not an independent-team audit or a formal proof.",
            "Trạng thái chính xác và không thổi phồng. 'Đã chứng minh' nghĩa là chứng minh nội bộ, 'thẩm định' nghĩa là tính toán hữu hạn chính xác, 'có cơ sở' và 'tạm thời' yếu hơn. Trần evidence là I2: hai bản cài cùng tác giả, chưa phải audit đội độc lập hay chứng minh hình thức.")}</p>

          <h2>{t(L, "Publication governance", "Quản trị công bố")}</h2>
          <p>{t(L,
            "Nothing appears here automatically. Each release passes five gates: scope correct, evidence label correct, no private path or secret, public explanation reviewed, and Owner approval. An automated scanner blocks any snapshot that leaks a filesystem path, over-states evidence, or could be read as claiming the conjecture is already settled.",
            "Không gì xuất hiện tự động. Mỗi release qua năm cổng: phạm vi đúng, nhãn evidence đúng, không lộ path hay bí mật, giải thích công khai đã review, và Owner duyệt. Một scanner tự động chặn mọi snapshot làm lộ path filesystem, thổi phồng evidence, hoặc có thể bị đọc thành đã giải xong giả thuyết.")}</p>

          <h2>{t(L, "Standing status", "Trạng thái thường trực")}</h2>
          <p className="og-tech">{t(L,
            "LRC(13) remains OPEN. The project has not solved it. It has built verifiable infrastructure and narrowed the mathematical obstruction, one reviewed gate at a time.",
            "LRC(13) vẫn MỞ. Dự án chưa giải nó. Dự án đã xây hạ tầng kiểm chứng được và thu hẹp trở ngại toán học, từng gate đã duyệt một.")}</p>
        </div>
        <aside className="og-about-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vitruvian.png" alt="" aria-hidden />
          <span className="og-about-cap">{t(L, "Vitruvian Man · proportion & geometry", "Người Vitruvius · tỉ lệ & hình học")}</span>
        </aside>
      </div>
    </main>
  );
}
