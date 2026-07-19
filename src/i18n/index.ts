import en from "./en.json";
import vi from "./vi.json";

export const LOCALES = ["en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];

export type Messages = typeof en;

const registry: Record<Locale, Messages> = { en, vi: vi as Messages };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return registry[locale];
}

/** Flatten nested message object into dot-path keys. */
export function flattenKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flattenKeys(v, prefix ? `${prefix}.${k}` : k),
  );
}

/** Throws when en/vi key sets diverge — used by unit tests and dev assert. */
export function assertKeyParity(): void {
  const enKeys = new Set(flattenKeys(en));
  const viKeys = new Set(flattenKeys(vi));
  const missingInVi = [...enKeys].filter((k) => !viKeys.has(k));
  const missingInEn = [...viKeys].filter((k) => !enKeys.has(k));
  if (missingInVi.length > 0 || missingInEn.length > 0) {
    throw new Error(
      `i18n key parity violation. Missing in vi: [${missingInVi.join(", ")}]. Missing in en: [${missingInEn.join(", ")}]`,
    );
  }
}
