import type { ReactNode } from "react";
import type { Locale, Messages } from "@/i18n";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
};

export function AppShell({ locale, messages, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar locale={locale} messages={messages} />
      <main className="app-main" data-testid="main">
        {children}
      </main>
    </div>
  );
}
