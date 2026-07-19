import { Check, Star } from "lucide-react";
import type { Messages } from "@/i18n";
import type { ReproductionStageVM } from "@/data/adapters/researchOverviewAdapter";
import { LadderIcon } from "@/components/shell/icons";

type ReproductionLadderProps = {
  messages: Messages;
  stages: ReproductionStageVM[];
};

function StageNode({ stage }: { stage: ReproductionStageVM }) {
  return (
    <div className={`ladder-stage ladder-${stage.state}`} data-k={stage.k}>
      <span className="ladder-node" aria-hidden="true">
        {stage.state === "completed" && <Check className="ladder-node-check" strokeWidth={2.5} />}
        {stage.state === "target" && <Star className="ladder-node-star" strokeWidth={1.5} fill="currentColor" />}
      </span>
      <span className="ladder-k">k = {stage.k}</span>
      <span className="ladder-state">{stage.stateLabel}</span>
    </div>
  );
}

export function ReproductionLadder({ messages, stages }: ReproductionLadderProps) {
  return (
    <section
      className="card reproduction-ladder"
      aria-label={messages.reproduction.title}
      data-testid="reproduction-ladder"
    >
      <header className="card-header">
        <span className="card-title-group">
          <LadderIcon className="card-title-icon" aria-hidden="true" />
          <h2 className="card-title">{messages.reproduction.title}</h2>
        </span>
      </header>
      <div className="ladder-track">
        {stages.map((s, i) => (
          <div className="ladder-cell" key={s.k}>
            {i > 0 && <span className="ladder-connector" aria-hidden="true" />}
            <StageNode stage={s} />
          </div>
        ))}
      </div>
      <footer className="ladder-legend">
        <span className="legend-item">
          <span className="legend-dot legend-completed" aria-hidden="true" />
          {messages.statuses.completed}
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-next" aria-hidden="true" />
          {messages.statuses.next}
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-pending" aria-hidden="true" />
          {messages.statuses.pending}
        </span>
        <span className="legend-item">
          <Star className="legend-star" strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
          {messages.statuses.target}
        </span>
      </footer>
    </section>
  );
}
