"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  FileText,
  ChartNoAxesCombined,
  Workflow,
  ShieldCheck,
  Gauge,
  TriangleAlert,
  Database,
  NotebookPen,
  Archive,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { Locale, Messages } from "@/i18n";
import { LadderIcon, HoneycombLogo } from "./icons";

type NavKey = keyof Messages["nav"];

const NAV_ITEMS: Array<{ key: NavKey; icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>> }> = [
  { key: "overview", icon: House },
  { key: "claims", icon: FileText },
  { key: "reproduction", icon: LadderIcon },
  { key: "campaigns", icon: ChartNoAxesCombined },
  { key: "workflow", icon: Workflow },
  { key: "verification", icon: ShieldCheck },
  { key: "effectiveness", icon: Gauge },
  { key: "risks", icon: TriangleAlert },
  { key: "resources", icon: Database },
  { key: "notes", icon: NotebookPen },
  { key: "artifacts", icon: Archive },
  { key: "settings", icon: Settings },
];

type SidebarProps = {
  locale: Locale;
  messages: Messages;
};

export function Sidebar({ locale, messages }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar" data-testid="sidebar">
      <div className="sidebar-brand">
        <HoneycombLogo className="sidebar-logo-glyph" aria-hidden="true" />
        <span className="sidebar-wordmark">HIVE</span>
      </div>
      <nav className="sidebar-nav" aria-label={messages.nav.overview}>
        <ul>
          {NAV_ITEMS.map(({ key, icon: Icon }) => {
            const href = key === "overview" ? `/${locale}/console` : `/${locale}/${key}`;
            const active =
              pathname === href || (key === "overview" && (pathname === `/${locale}` || pathname === `/${locale}/console`));
            return (
              <li key={key}>
                <Link
                  href={href}
                  className={`sidebar-item${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  title={messages.nav[key]}
                >
                  <Icon className="sidebar-icon" strokeWidth={1.5} aria-hidden="true" />
                  <span className="sidebar-label">{messages.nav[key]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar-status" data-testid="sidebar-status">
        <span className="sidebar-status-dot" aria-hidden="true" />
        <div className="sidebar-status-text">
          <span className="sidebar-status-title">{messages.system.status}</span>
          <span className="sidebar-status-sub">{messages.system.nominal}</span>
        </div>
      </div>
    </aside>
  );
}
