import type { SVGProps } from "react";

/**
 * Custom monochrome SVG glyphs where Lucide has no equivalent.
 * Drawn on a 24px grid, stroke 1.5, to match Lucide's visual language.
 */

export function LadderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 3v18" />
      <path d="M16 3v18" />
      <path d="M8 7h8" />
      <path d="M8 12h8" />
      <path d="M8 17h8" />
    </svg>
  );
}

export function HoneycombLogo(props: SVGProps<SVGSVGElement>) {
  // Seven hexagons in a flower arrangement, matching the golden mock logo box.
  const hex = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i - 30);
      pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(" ");
  };
  const r = 7.6;
  const dx = r * Math.sqrt(3);
  const centers: Array<[number, number]> = [
    [29, 29],
    [29, 29 - 2 * r * 0.75 * 2] as [number, number],
  ];
  // recompute properly: flat "pointy-top" hex flower
  const flower: Array<[number, number]> = [
    [29, 29],
    [29, 29 - 15.2],
    [29, 29 + 15.2],
    [29 - dx, 29 - 7.6],
    [29 - dx, 29 + 7.6],
    [29 + dx, 29 - 7.6],
    [29 + dx, 29 + 7.6],
  ];
  void centers;
  return (
    <svg viewBox="0 0 58 58" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...props}>
      {flower.map(([cx, cy], i) => (
        <polygon key={i} points={hex(cx, cy, r)} />
      ))}
    </svg>
  );
}
