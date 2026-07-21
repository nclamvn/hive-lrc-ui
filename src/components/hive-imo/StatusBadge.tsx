import type { Status } from "@/lib/imo/ledger";
import { STATUS_LABELS, type Locale } from "@/lib/imo/copy";

// Tone mapping. Green ("done") is reserved for the independently-verified tiers
// only, so the palette never implies an unearned "solved" (brief §2 / §8).
const TONE: Record<Status, "pending" | "active" | "warn" | "done"> = {
  "NOT-STARTED": "pending",
  "FROZEN-PENDING-REVIEW": "pending",
  "OFFICIAL-FROZEN": "pending",
  "HUMAN-READ": "pending",
  "AI-READ": "pending",
  "DECOMPOSED": "pending",
  "CANDIDATE-LEMMA": "active",
  "CANDIDATE-PROOF": "active",
  "COUNTEREXAMPLE-FOUND": "warn",
  "REPAIR-IN-PROGRESS": "warn",
  "VERIFIED-INTERNAL": "active",
  "VERIFIED-INDEPENDENT": "done",
  "FORMALIZED": "done",
  "PUBLISHED": "done",
};

export function StatusBadge({ status, locale }: { status: Status; locale: Locale }) {
  const label = STATUS_LABELS[status];
  return (
    <span className={`hi-badge ${TONE[status]}`} title={status}>
      {locale === "vi" ? label.vi : label.en}
    </span>
  );
}
