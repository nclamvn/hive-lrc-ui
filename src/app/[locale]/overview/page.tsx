import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { ObservatoryShell } from "@/components/observatory-golden/ObservatoryShell";
import { GoldenOverview } from "@/components/observatory-golden/GoldenOverview";
import { buildGoldenVM } from "@/lib/goldenOverviewData";
import type { Locale } from "@/lib/observatory";
import "@/styles/observatory-golden-tokens.css";
import "@/styles/observatory-golden.css";

export default async function OverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const golden = sp.fixture === "golden";
  const vm = buildGoldenVM(locale as Locale, golden);
  return (
    <ObservatoryShell locale={locale as Locale} page="observatory-overview" golden={golden}>
      <GoldenOverview locale={locale as Locale} vm={vm} />
    </ObservatoryShell>
  );
}
