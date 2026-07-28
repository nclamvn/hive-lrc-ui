// Client-side history of completed solves, persisted in localStorage. No server
// state — this is the user's own scratch history.

import type { Session } from "@/lib/solver/types";

const KEY = "solver-sessions";
const LIMIT = 40;

export function listSessions(): Session[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Session[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(sessions: Session[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(sessions.slice(0, LIMIT)));
  } catch {
    // quota / disabled storage — non-fatal
  }
}

export function saveSession(session: Session): Session[] {
  const rest = listSessions().filter((s) => s.id !== session.id);
  const next = [session, ...rest];
  write(next);
  return next;
}

export function deleteSession(id: string): Session[] {
  const next = listSessions().filter((s) => s.id !== id);
  write(next);
  return next;
}

export function clearSessions(): Session[] {
  write([]);
  return [];
}
