import { notFound } from "next/navigation";
import { Target, Activity, CircleCheck, Search } from "lucide-react";
import { getMessages, isLocale } from "@/i18n";
import { buildOverviewViewModel } from "@/data/adapters/researchOverviewAdapter";
import { AppShell } from "@/components/shell/AppShell";
import { TopHeader } from "@/components/shell/TopHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ClaimLedger } from "@/components/dashboard/ClaimLedger";
import { ReproductionLadder } from "@/components/dashboard/ReproductionLadder";
import { BottleneckChart } from "@/components/dashboard/BottleneckChart";
import { WorkflowStepper } from "@/components/dashboard/WorkflowStepper";
import { RiskRegister } from "@/components/dashboard/RiskRegister";
import { ResourceProfile } from "@/components/dashboard/ResourceProfile";
import { RelationshipGraph } from "@/components/dashboard/RelationshipGraph";
import { NotesNextActions } from "@/components/dashboard/NotesNextActions";
import { InlineMath } from "@/components/math/InlineMath";

export default async function ConsolePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const demoMode = sp.demo === "1";

  const messages = getMessages(locale);
  const vm = buildOverviewViewModel(messages, locale, demoMode);

  return (
    <AppShell locale={locale} messages={messages}>
      <TopHeader locale={locale} messages={messages} meta={vm.headerMeta} />

      <div className="metrics-row" data-testid="metrics-row">
        <MetricCard
          label={messages.metrics.targetClaim}
          value={<InlineMath latex={vm.metrics.targetClaimLatex} ariaLabel="L R C of thirteen" />}
          icon={Target}
          ariaLabel={messages.metrics.targetClaim}
        />
        <MetricCard
          label={messages.metrics.currentPhase}
          value={vm.metrics.currentPhase}
          icon={Activity}
          ariaLabel={messages.metrics.currentPhase}
        />
        <MetricCard
          label={messages.metrics.bestVerifiedResult}
          value={messages.metrics.reproducedK9}
          icon={CircleCheck}
          ariaLabel={messages.metrics.bestVerifiedResult}
        />
        <MetricCard
          label={messages.metrics.researchProfile}
          value={messages.metrics.investigation}
          icon={Search}
          ariaLabel={messages.metrics.researchProfile}
        />
      </div>

      <div className="primary-row" data-testid="primary-row">
        <ClaimLedger locale={locale} messages={messages} claims={vm.claims} />
        <ReproductionLadder messages={messages} stages={vm.reproduction} />
        <BottleneckChart messages={messages} data={vm.bottleneck} />
      </div>

      <div className="workflow-row" data-testid="workflow-row">
        <WorkflowStepper messages={messages} steps={vm.workflow} />
        <RiskRegister locale={locale} messages={messages} risks={vm.risks} />
        <ResourceProfile messages={messages} buckets={vm.resources} />
      </div>

      <div className="dependency-row" data-testid="dependency-row">
        <RelationshipGraph locale={locale} messages={messages} variant="overview" />
        <NotesNextActions messages={messages} notes={vm.notes} />
      </div>
    </AppShell>
  );
}
