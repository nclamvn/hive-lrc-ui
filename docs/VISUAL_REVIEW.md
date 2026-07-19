# VISUAL_REVIEW — HIVE-LRC Observatory Golden Overview

viewport: 1586 × 992
DPR: 1
browser: Chromium (Playwright)
locale: en, timezone UTC, reduced motion, fonts document.fonts.ready awaited
route: /en/overview?fixture=golden  (data-page="observatory-overview", data-golden="true")

## Measured (honest, against the external Golden Master PNG)
pixel diff ratio: 0.094683   (148,966 / 1,573,312 px)      gate <= 0.00030  -> NOT MET
SSIM: not computed separately (diff ratio already ~300x over gate)
major region displacement: within a few px (bands overlap; see diff.png)
missing / extra components: none — all 7 regions present and positioned

## Honest assessment of the gate
The 0.00030 gate (<=476 diff px) is NOT achievable by independent HTML reconstruction of an externally
authored mockup PNG whose source HTML/font files are not provided. The diff.png shows the LAYOUT aligns
(header, hero, 4 cards, map, feed, lower panels, footer all overlap in the right bands) but EVERY glyph and
map node renders as a difference because:
- font rasterization differs (Newsreader/Inter glyph outlines, hinting, sub-pixel positions differ from
  whatever rendered the mock) — text alone is a large fraction of the 9.5%;
- exact map node pixel positions/sizes differ from the mock's render (SVG coords approximate the fixture);
- anti-aliasing and 1px metric differences accumulate across a dense information layout.
This matches the Owner's chosen path: build high-fidelity, report the true number, do NOT re-baseline the
mock to fake a pass. Verdict for the pixel gate: PARTIAL (functionally complete, gate not numerically met).

## What IS achieved (functional/visual fidelity)
- Structure, grid, band geometry, tokens, typography scale, monochrome + single green accent per spec.
- All fixture content verbatim (hero, 4 metric cards, 5 feed events, 26 graph nodes + 26 edges at LOCKED
  coordinates, no force layout), deterministic golden mode (?fixture=golden, animations off).
- data-region attributes on all 7 regions for the region tests; data-page root.
- Console preserved at /en/console (its 15 golden tests re-pointed and green).

## files changed
src/app/[locale]/overview/page.tsx (now golden Observatory), src/app/[locale]/console/page.tsx (moved
console), src/components/observatory-golden/GoldenOverview.tsx, src/styles/observatory-golden{,-tokens}.css,
src/data/observatory-golden/fixture.json, src/app/[locale]/layout.tsx (Newsreader font),
src/components/shell/Sidebar.tsx (overview→console), tests updated.

## known deviations (require Owner/Contractor approval to accept)
- Pixel gate 0.00030 not met (0.0947) — external-mock reconstruction ceiling.
- Map node captions are partial vs the mock (a few captions rendered, not all).
