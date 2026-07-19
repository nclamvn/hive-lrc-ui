"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings2, Menu, X } from "lucide-react";

type Locale = "en" | "vi";

const NAV: { key: string; en: string; vi: string; href: (l: string) => string; match: (seg: string, path: string, l: string) => boolean }[] = [
  { key: "overview", en: "Overview", vi: "Tổng quan", href: (l) => `/${l}/overview`, match: (_s, p, l) => p === `/${l}/overview` },
  { key: "map", en: "Research Map", vi: "Bản đồ", href: (l) => `/${l}/observatory/map`, match: (s) => s === "map" },
  { key: "gates", en: "Gates", vi: "Gate", href: (l) => `/${l}/observatory/gates`, match: (s) => s === "gates" },
  { key: "claims", en: "Claims", vi: "Claim", href: (l) => `/${l}/observatory/claims`, match: (s) => s === "claims" },
  { key: "methods", en: "Methods", vi: "Phương pháp", href: (l) => `/${l}/observatory/methods`, match: (s) => s === "methods" },
  { key: "verification", en: "Verification", vi: "Kiểm chứng", href: (l) => `/${l}/observatory/verification`, match: (s) => s === "verification" },
  { key: "journal", en: "Journal", vi: "Nhật ký", href: (l) => `/${l}/observatory/journal`, match: (s) => s === "journal" },
  { key: "about", en: "About", vi: "Giới thiệu", href: (l) => `/${l}/observatory/about`, match: (s) => s === "about" },
];

export function Hexmark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" aria-hidden>
      <path d="M15 2.5 26 9v12L15 27.5 4 21V9L15 2.5Z" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15 9.2 20.5 12.4v6.4L15 22 9.5 18.8v-6.4L15 9.2Z" stroke="#111" strokeWidth="1" strokeLinejoin="round" opacity=".5" />
    </svg>
  );
}

export function ObservatoryShell({
  locale, page, golden, children,
}: { locale: Locale; page: string; golden?: boolean; children: React.ReactNode }) {
  const pathname = usePathname() ?? `/${locale}/overview`;
  const seg = pathname.replace(/^\/(en|vi)\/observatory\/?/, "").split("/")[0] ?? "";
  const other: Locale = locale === "en" ? "vi" : "en";
  const otherHref = pathname.replace(/^\/(en|vi)/, `/${other}`);

  const [depth, setDepth] = useState<"read" | "audit">("read");
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const s = localStorage.getItem("obs-depth");
    if (s === "audit" || s === "read") setDepth(s);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  const flip = (d: "read" | "audit") => { setDepth(d); localStorage.setItem("obs-depth", d); };
  const L = (en: string, vi: string) => (locale === "vi" ? vi : en);

  return (
    <div className="og" data-page={page} data-golden={golden ? "true" : undefined} data-depth={depth}
         style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header className="og-header" data-region="header">
        <div className="og-header-in">
          <Link href={`/${locale}/overview`} className="og-brand">
            <Hexmark className="og-brand-logo" />
            <span className="og-brand-txt">
              <span className="og-brand-name">HIVE-LRC</span>
              <span className="og-brand-sub">Observatory</span>
            </span>
          </Link>
          <nav className="og-nav" aria-label="Observatory">
            {NAV.map((n) => {
              const active = n.match(seg, pathname, locale);
              return (
                <Link key={n.key} href={n.href(locale)} className={active ? "active" : undefined}
                      aria-current={active ? "page" : undefined}>
                  {L(n.en, n.vi)}
                </Link>
              );
            })}
          </nav>
          <div className="og-header-right">
            <button className="og-icon-btn" onClick={() => flip(depth === "read" ? "audit" : "read")}
                    title={L("Toggle Read / Audit detail", "Chuyển Đọc / Kiểm toán")}
                    aria-label={L("Toggle detail level", "Chuyển mức chi tiết")} aria-pressed={depth === "audit"}>
              <Settings2 size={15} strokeWidth={1.5} />
            </button>
            <div className="og-seg" role="group" aria-label="depth">
              <span role="button" tabIndex={0} className={depth === "read" ? "on" : ""} onClick={() => flip("read")}
                    onKeyDown={(e) => e.key === "Enter" && flip("read")} style={{ cursor: "pointer" }}>{L("Read", "Đọc")}</span>
              <span role="button" tabIndex={0} className={depth === "audit" ? "on" : ""} onClick={() => flip("audit")}
                    onKeyDown={(e) => e.key === "Enter" && flip("audit")} style={{ cursor: "pointer" }}>{L("Audit", "Kiểm toán")}</span>
            </div>
            <Link className="og-lang" href={otherHref}>{other.toUpperCase()}</Link>
            <button className="og-menu-btn" aria-label={L("Menu", "Menu")} aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((o) => !o)}>
              {menuOpen ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="og-mobile-nav" aria-label="Observatory mobile">
            {NAV.map((n) => {
              const active = n.match(seg, pathname, locale);
              return (
                <Link key={n.key} href={n.href(locale)} className={active ? "active" : undefined}
                      onClick={() => setMenuOpen(false)}>
                  {L(n.en, n.vi)}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <div style={{ flex: 1 }}>{children}</div>

      <footer className="og-footer" data-region="footer">
        <div className="og-footer-in">
          <span><strong style={{ color: "var(--obs-ink)" }}>{L("LRC(13) remains open.", "LRC(13) vẫn mở.")}</strong>{" "}
            {L("Intermediate internal results under the displayed evidence and scope · I2.",
               "Kết quả nội bộ trung gian theo evidence và phạm vi hiển thị · I2.")}</span>
          <div className="og-footer-links">
            <Link href={`/${locale}/observatory/verification`}>{L("Verification", "Kiểm chứng")}</Link>
            <Link href={`/${locale}/observatory/journal`}>{L("Journal", "Nhật ký")}</Link>
            <Link href={`/${locale}/observatory/about`}>{L("About", "Giới thiệu")}</Link>
          </div>
          <div className="og-footer-right">
            <span>{L("Developed by Lâm Nguyễn", "Phát triển bởi Lâm Nguyễn")}</span>
            <span className="live"><span className="d" />Live</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
