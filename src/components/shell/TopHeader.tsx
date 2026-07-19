"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calendar, Database, CircleUser, ChevronDown, Check } from "lucide-react";
import type { Locale, Messages } from "@/i18n";
import type { HeaderMetaVM } from "@/data/adapters/researchOverviewAdapter";

type TopHeaderProps = {
  locale: Locale;
  messages: Messages;
  meta: HeaderMetaVM;
};

export function TopHeader({ locale, messages, meta }: TopHeaderProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchLocale = (target: Locale) => {
    const rest = pathname.replace(/^\/(en|vi)/, "");
    const qs = searchParams.toString();
    router.push(`/${target}${rest || "/overview"}${qs ? `?${qs}` : ""}`);
    setOpen(false);
  };

  return (
    <header className="topheader" data-testid="header">
      <div className="topheader-left">
        <h1 className="topheader-title">{messages.app.title}</h1>
        <p className="topheader-subtitle">{messages.app.subtitle}</p>
      </div>
      <div className="topheader-right">
        <div className="meta-cluster" data-testid="meta-date">
          <Calendar className="meta-icon" strokeWidth={1.5} aria-hidden="true" />
          <div className="meta-text">
            <span className="meta-primary">{meta.date}</span>
            <span className="meta-secondary">{meta.timezone}</span>
          </div>
        </div>
        <div className="meta-cluster" data-testid="meta-version">
          <Database className="meta-icon" strokeWidth={1.5} aria-hidden="true" />
          <div className="meta-text">
            <span className="meta-primary">{meta.version}</span>
            <span className="meta-secondary">{meta.build}</span>
          </div>
        </div>
        <div className="profile" ref={rootRef}>
          <button
            type="button"
            className="profile-button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={messages.header.profileMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <CircleUser className="profile-avatar" strokeWidth={1.5} aria-hidden="true" />
            <div className="meta-text">
              <span className="meta-primary">{messages.header.researchLead}</span>
              <span className="meta-secondary">{messages.header.operator}</span>
            </div>
            <ChevronDown className="profile-chevron" strokeWidth={1.5} aria-hidden="true" />
          </button>
          {open && (
            <div className="profile-menu" role="menu" aria-label={messages.app.language}>
              <span className="profile-menu-label">{messages.app.language}</span>
              {(
                [
                  ["en", "English"],
                  ["vi", "Tiếng Việt"],
                ] as Array<[Locale, string]>
              ).map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  role="menuitem"
                  className="profile-menu-item"
                  onClick={() => switchLocale(code)}
                >
                  <span>{label}</span>
                  {locale === code && <Check className="profile-menu-check" strokeWidth={1.5} aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
