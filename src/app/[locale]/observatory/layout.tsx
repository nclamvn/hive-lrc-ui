import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { ObservatoryShell } from "@/components/observatory-golden/ObservatoryShell";
import type { Locale } from "@/lib/observatory";
import "@/styles/observatory-golden-tokens.css";
import "@/styles/observatory-golden.css";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

export default async function ObservatoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <ObservatoryShell locale={locale as Locale} page="observatory">
      {children}
    </ObservatoryShell>
  );
}
