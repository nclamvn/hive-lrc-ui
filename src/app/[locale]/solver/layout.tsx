import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import type { Locale } from "@/lib/imo/copy";
import { ObservatoryShell } from "@/components/observatory-golden/ObservatoryShell";
// Shared site chrome, with the academic `.hi` theme scoped to the page body —
// same composition as the HIVE-IMO section.
import "@/styles/observatory-golden-tokens.css";
import "@/styles/observatory-golden.css";
import "@/styles/hive-imo.css";
import "@/styles/solver.css";

export default async function SolverLayout({
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
    <ObservatoryShell locale={L} page="solver">
      <div className="hi hi-embedded">{children}</div>
    </ObservatoryShell>
  );
}
