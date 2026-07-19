import Link from "next/link";
import { List, ArrowRight } from "lucide-react";
import type { Locale, Messages } from "@/i18n";
import type { ClaimRowVM } from "@/data/adapters/researchOverviewAdapter";

type ClaimLedgerProps = {
  locale: Locale;
  messages: Messages;
  claims: ClaimRowVM[];
};

export function ClaimLedger({ locale, messages, claims }: ClaimLedgerProps) {
  return (
    <section className="card claim-ledger" aria-label={messages.claims.title} data-testid="claim-ledger">
      <header className="card-header">
        <span className="card-title-group">
          <List className="card-title-icon" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="card-title">{messages.claims.title}</h2>
        </span>
        <Link className="view-all" href={`/${locale}/claims`}>
          {messages.claims.viewAll}
          <ArrowRight className="view-all-icon" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </header>
      <table className="claims-table">
        <thead>
          <tr>
            <th scope="col">{messages.claims.id}</th>
            <th scope="col">{messages.claims.claim}</th>
            <th scope="col">{messages.claims.status}</th>
            <th scope="col">{messages.claims.novelty}</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((c) => (
            <tr key={c.id} data-claim-id={c.id}>
              <td className="claim-id">{c.id}</td>
              <td className="claim-label">
                <Link
                  href={`/${locale}/claims#${c.id}`}
                  className="claim-link"
                  title={c.label}
                >
                  {c.label}
                </Link>
              </td>
              <td>
                <span className={`pill pill-${c.status}`} title={c.statusLabel}>
                  {c.statusLabel}
                </span>
              </td>
              <td className="claim-novelty">{c.noveltyLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
