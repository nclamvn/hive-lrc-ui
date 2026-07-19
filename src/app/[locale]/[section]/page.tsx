import { notFound } from "next/navigation";
import { getMessages, isLocale, type Messages } from "@/i18n";
import { AppShell } from "@/components/shell/AppShell";
import { WikiBlocks } from "@/components/wiki/WikiBlocks";
import { MilestoneTimeline } from "@/components/wiki/MilestoneTimeline";
import { MethodEffectivenessPage } from "@/components/effectiveness/MethodEffectivenessPage";
import { sections, workflowIntro } from "@/data/wiki/content";
import { gates } from "@/data/wiki/gates";

const NAV_SECTIONS = [
  "claims", "reproduction", "campaigns", "workflow",
  "verification", "effectiveness", "risks", "resources", "notes", "artifacts", "settings",
] as const;

type Section = (typeof NAV_SECTIONS)[number];

export function generateStaticParams() {
  return NAV_SECTIONS.flatMap((s) => [
    { locale: "en", section: s },
    { locale: "vi", section: s },
  ]);
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  if (!isLocale(locale)) notFound();
  if (!(NAV_SECTIONS as readonly string[]).includes(section)) notFound();

  const messages = getMessages(locale);
  const navTitle = messages.nav[section as Section satisfies keyof Messages["nav"]];

  // "effectiveness" is the method-effectiveness dashboard page.
  if (section === "effectiveness") {
    return (
      <AppShell locale={locale} messages={messages}>
        <MethodEffectivenessPage locale={locale} />
      </AppShell>
    );
  }

  // "workflow" is the milestones timeline; every other section is a wiki page.
  if (section === "workflow") {
    const passed = gates.filter((g) => g.status === "pass").length;
    const doubled = gates.filter((g) => g.verify === "double").length;
    return (
      <AppShell locale={locale} messages={messages}>
        <article className="wiki-page">
          <header className="wiki-header">
            <div className="wiki-eyebrow">HIVE-LRC · {locale === "vi" ? "Bài toán & Cột mốc" : "Problem & Milestones"}</div>
            <h1 className="wiki-title">{navTitle}</h1>
            <p className="wiki-subtitle">
              {locale === "vi"
                ? "Mô tả bài toán, lịch sử, và dòng thời gian các gate, mỗi mốc có mức kiểm chứng và bằng chứng double-check."
                : "Problem statement, history, and the gate timeline, each milestone carrying a verification level and double-check evidence."}
            </p>
            <div className="wiki-meter">
              <span><strong>{gates.length}</strong> {locale === "vi" ? "cột mốc" : "milestones"}</span>
              <span><strong>{passed}</strong> {locale === "vi" ? "đạt" : "passed"}</span>
              <span><strong>{doubled}</strong> {locale === "vi" ? "kiểm kép" : "double-checked"}</span>
            </div>
          </header>
          <WikiBlocks blocks={workflowIntro} locale={locale} />
          <h2 className="wiki-section-heading">{locale === "vi" ? "Dòng thời gian cột mốc" : "Milestone timeline"}</h2>
          <MilestoneTimeline locale={locale} />
        </article>
      </AppShell>
    );
  }

  const content = sections[section];
  if (!content) {
    return (
      <AppShell locale={locale} messages={messages}>
        <article className="wiki-page">
          <header className="wiki-header">
            <h1 className="wiki-title">{navTitle}</h1>
          </header>
        </article>
      </AppShell>
    );
  }
  const tx = (o: { en: string; vi: string }) => (locale === "vi" ? o.vi : o.en);
  return (
    <AppShell locale={locale} messages={messages}>
      <article className="wiki-page">
        <header className="wiki-header">
          <div className="wiki-eyebrow">HIVE-LRC · {locale === "vi" ? "Tài liệu" : "Dossier"}</div>
          <h1 className="wiki-title">{tx(content.title)}</h1>
          <p className="wiki-subtitle">{tx(content.subtitle)}</p>
          <div className="wiki-meta-line">{locale === "vi" ? "Cập nhật" : "Updated"} {content.updated}</div>
        </header>
        <WikiBlocks blocks={content.blocks} locale={locale} />
      </article>
    </AppShell>
  );
}
