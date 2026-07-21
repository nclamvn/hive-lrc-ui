import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import type { Locale } from "@/lib/imo/copy";
import { ObservatoryShell } from "@/components/observatory-golden/ObservatoryShell";
import { ImoColophon } from "@/components/hive-imo/ImoColophon";
// Shared site chrome (header/nav/footer) so HIVE-IMO reads as a section of the
// main site, with the "IMO 2026" tab highlighted...
import "@/styles/observatory-golden-tokens.css";
import "@/styles/observatory-golden.css";
// ...while the page body keeps its own academic theme, scoped under `.hi`.
import "@/styles/hive-imo.css";

export default async function HiveImoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const L = locale as Locale;
  return (
    <ObservatoryShell locale={L} page="hive-imo">
      <div className="hi hi-embedded">
        {children}
        <ImoColophon locale={L} />
      </div>
    </ObservatoryShell>
  );
}
