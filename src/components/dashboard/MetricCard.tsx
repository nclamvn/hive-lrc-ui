import type { ReactNode, ComponentType, SVGProps } from "react";

export type MetricCardProps = {
  label: string;
  value: ReactNode;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  ariaLabel: string;
};

export function MetricCard({ label, value, icon: Icon, ariaLabel }: MetricCardProps) {
  return (
    <section className="card metric-card" aria-label={ariaLabel} data-testid="metric-card">
      <div className="metric-body">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
      </div>
      <span className="metric-icon-circle" aria-hidden="true">
        <Icon className="metric-icon" strokeWidth={1.5} />
      </span>
    </section>
  );
}
