import { t, type Locale } from "@/lib/imo/copy";

// The HIVE-IMO independent-project disclaimer (brief §12 claim safety). Rendered
// at the end of the academic body since the shared site footer belongs to the
// Observatory chrome.
export function ImoColophon({ locale }: { locale: Locale }) {
  return (
    <div className="hi-colophon">
      <div className="hi-wrap">
        <p>
          <strong>{t(locale, "HIVE-IMO X is an independent research project.", "HIVE-IMO X là một dự án nghiên cứu độc lập.")}</strong>{" "}
          {t(locale,
            "Not affiliated with or sponsored by the International Mathematical Olympiad. Problem texts belong to their authors. Human Owner Lâm Nguyễn holds academic responsibility; Sol and Fable are AI collaborators, not accountable authors.",
            "Không liên kết hay được tài trợ bởi International Mathematical Olympiad. Văn bản đề thuộc về tác giả của chúng. Human Owner Lâm Nguyễn chịu trách nhiệm học thuật; Sol và Fable là cộng tác viên AI, không phải người chịu trách nhiệm.")}
        </p>
      </div>
    </div>
  );
}
