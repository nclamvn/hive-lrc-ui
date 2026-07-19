import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";
import type { Locale, Messages } from "@/i18n";
import type { RiskRowVM } from "@/data/adapters/researchOverviewAdapter";

type RiskRegisterProps = {
  locale: Locale;
  messages: Messages;
  risks: RiskRowVM[];
};

export function RiskRegister({ locale, messages, risks }: RiskRegisterProps) {
  return (
    <section className="card risk-register" aria-label={messages.risks.title} data-testid="risk-register">
      <header className="card-header">
        <span className="card-title-group">
          <ShieldAlert className="card-title-icon" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="card-title">{messages.risks.title}</h2>
        </span>
        <Link className="view-all" href={`/${locale}/risks`}>
          {messages.claims.viewAll}
          <ArrowRight className="view-all-icon" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </header>
      <table className="risks-table">
        <thead>
          <tr>
            <th scope="col">{messages.claims.id}</th>
            <th scope="col">{messages.risks.risk}</th>
            <th scope="col" className="risks-priority-col">
              {messages.risks.priority}
            </th>
          </tr>
        </thead>
        <tbody>
          {risks.map((r) => (
            <tr key={r.id} data-risk-id={r.id}>
              <td className="risk-id">{r.id}</td>
              <td className="risk-label" title={r.label}>
                {r.label}
              </td>
              <td className="risks-priority-col">
                {r.resolved ? (
                  <span className="pill pill-resolved" title={r.resolvedLabel}>
                    {r.resolvedLabel}
                  </span>
                ) : (
                  <span className="pill pill-priority">{r.priority}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
