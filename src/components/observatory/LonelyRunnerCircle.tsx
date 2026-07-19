"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

/**
 * Lonely Runner Conjecture, live explainer (LRC(3) by default).
 *
 * The observer sits still at the top of a unit track; the other runners orbit at
 * distinct speeds. The observer is "lonely" at times when every other runner is at
 * circular distance >= 1/n. The shaded arc is the observer's 1/n personal space; it
 * glows toward accent-green as the nearest runner recedes, reaching full green (and a
 * "lonely" label) at the tight moment. Speeds 1,2,3 with n=4 is the extremal case that
 * touches exactly 1/4 at t = 1/4 and 3/4.
 */

const C = 120; // centre
const R = 92; // track radius
const PERIOD_MS = 9000; // one full t in [0,1)
const LONELY_FRAME = 0.25; // deterministic frame for SSR / static / reduced-motion

const INK = "#111111";
const INK2 = "#66645f";
const LINE = "#cbc8c0";
const SOFT = "#e9e7e1";
const PAPER = "#fffefc";
const ACCENT = "#2f9b50";

type Props = {
  speeds?: number[]; // relative speeds of the moving runners
  labels?: { lonely: string; caption?: string };
  static?: boolean; // freeze on the lonely frame (golden / pixel mode)
};

const frac = (x: number) => x - Math.floor(x);
const circDist = (p: number) => {
  const f = frac(p);
  return Math.min(f, 1 - f);
};

// point on the track at fractional position p (0 = top, clockwise)
function pt(p: number) {
  const a = 2 * Math.PI * p - Math.PI / 2;
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
}

// arc of the track from fractional position p0 to p1 (short way through +direction)
function trackArc(p0: number, p1: number) {
  const a = pt(p0);
  const b = pt(p1);
  const span = (p1 - p0) * 2 * Math.PI;
  const large = Math.abs(span) > Math.PI ? 1 : 0;
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

function mix(c1: string, c2: string, t: number) {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [r1, g1, b1] = h(c1);
  const [r2, g2, b2] = h(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function LonelyRunnerCircle({ speeds = [1, 2, 3], labels, static: isStatic }: Props) {
  const n = speeds.length + 1; // + the observer
  const gap = 1 / n; // lonely distance, as a fraction of the track
  const [t, setT] = useState(LONELY_FRAME);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // honour reduced-motion / static: start paused; otherwise auto-play on mount
  useEffect(() => {
    if (isStatic) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) setPlaying(true);
  }, [isStatic]);

  useEffect(() => {
    if (!playing) {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      startRef.current = null;
      return;
    }
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now - LONELY_FRAME * PERIOD_MS;
      setT(frac((now - startRef.current) / PERIOD_MS));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  const positions = speeds.map((s) => frac(s * t));
  const minDist = Math.min(...positions.map(circDist));
  const ratio = Math.min(minDist / gap, 1); // 1 == lonely
  const lonely = minDist >= gap - 1e-9;
  const zoneColor = mix(SOFT, ACCENT, ratio);
  const zoneWidth = 3 + 5 * ratio;

  const obs = pt(0);
  const lo = pt(-gap);
  const hi = pt(gap);

  return (
    <div className="og-lrc">
      <svg viewBox="0 0 240 240" role="img"
           aria-label="Lonely Runner Conjecture animation: runners orbiting a circular track">
        {/* track */}
        <circle cx={C} cy={C} r={R} fill="none" stroke={LINE} strokeWidth={1.4} />
        {/* observer personal-space arc (glows toward green as it becomes lonely) */}
        <path d={trackArc(-gap, gap)} fill="none" stroke={zoneColor} strokeWidth={zoneWidth}
              strokeLinecap="round" opacity={0.85} />
        {/* 1/n boundary ticks */}
        {[lo, hi].map((p, i) => {
          const inner = { x: C + (R - 9) * (p.x - C) / R, y: C + (R - 9) * (p.y - C) / R };
          const outer = { x: C + (R + 9) * (p.x - C) / R, y: C + (R + 9) * (p.y - C) / R };
          return <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                       stroke={LINE} strokeWidth={1.2} />;
        })}
        {/* moving runners */}
        {positions.map((p, i) => {
          const q = pt(p);
          return (
            <g key={i}>
              <circle cx={q.x} cy={q.y} r={6} fill={PAPER} stroke={INK2} strokeWidth={1.4} />
              <text x={q.x} y={q.y + 2.6} textAnchor="middle" fontSize="7.5"
                    fill={INK2} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                {speeds[i]}
              </text>
            </g>
          );
        })}
        {/* observer */}
        <circle cx={obs.x} cy={obs.y} r={7.5} fill={lonely ? ACCENT : INK} />
        <circle cx={obs.x} cy={obs.y} r={7.5} fill="none" stroke={PAPER} strokeWidth={1.6} />
        {/* lonely label */}
        {lonely && (
          <text x={C} y={30} textAnchor="middle" fontSize="11" fontWeight={600} fill={ACCENT}
                style={{ fontFamily: "var(--obs-font-ui, Inter), sans-serif" }}>
            {labels?.lonely ?? "Lonely"}
          </text>
        )}
      </svg>

      <div className="og-lrc-ctl">
        <button type="button" className="og-lrc-btn" onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={13} strokeWidth={1.8} /> : <Play size={13} strokeWidth={1.8} />}
        </button>
        {labels?.caption && <span className="og-lrc-cap">{labels.caption}</span>}
      </div>
    </div>
  );
}
