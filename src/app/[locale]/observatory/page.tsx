import { redirect, notFound } from "next/navigation";
import { isLocale } from "@/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

// The Observatory home IS the golden overview. Redirect to the canonical /overview route.
export default async function ObservatoryHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}/overview`);
}
