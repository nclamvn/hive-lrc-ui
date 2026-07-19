import {
  ScanLine,
  Users,
  Activity,
  Eye,
  ListChecks,
  FileCheck,
  Repeat,
  Crosshair,
  ArrowRight,
  Workflow as WorkflowIcon,
  type LucideIcon,
} from "lucide-react";
import type { Messages } from "@/i18n";

type WorkflowStep = { key: string; label: string; current: boolean };

type WorkflowStepperProps = {
  messages: Messages;
  steps: WorkflowStep[];
};

const STEP_ICONS: Record<string, LucideIcon> = {
  scan: ScanLine,
  contractorReview: Users,
  rri: Activity,
  vision: Eye,
  gateA: ListChecks,
  gateB: FileCheck,
  gateC: Repeat,
  attack: Crosshair,
};

export function WorkflowStepper({ messages, steps }: WorkflowStepperProps) {
  const currentIndex = steps.findIndex((s) => s.current);
  return (
    <section className="card workflow-stepper" aria-label={messages.workflow.title} data-testid="workflow-stepper">
      <header className="card-header">
        <span className="card-title-group">
          <WorkflowIcon className="card-title-icon" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="card-title">{messages.workflow.title}</h2>
        </span>
      </header>
      <ol className="workflow-track">
        {steps.map((s, i) => {
          const Icon = STEP_ICONS[s.key] ?? Activity;
          const phase = i < currentIndex ? "past" : s.current ? "current" : "future";
          return (
            <li key={s.key} className={`workflow-step workflow-${phase}`} aria-current={s.current ? "step" : undefined}>
              {i > 0 && <ArrowRight className="workflow-arrow" strokeWidth={1.5} aria-hidden="true" />}
              <div className="workflow-node-group" title={s.label}>
                <span className="workflow-node" aria-hidden="true">
                  <Icon className="workflow-node-icon" strokeWidth={1.5} />
                </span>
                <span className="workflow-label">{s.label}</span>
                {s.current && <span className="workflow-marker" aria-hidden="true" />}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="workflow-baseline" aria-hidden="true">
        {steps.map((s) => (
          <span key={s.key} className={`workflow-baseline-dot${s.current ? " is-current" : ""}`} />
        ))}
      </div>
    </section>
  );
}
