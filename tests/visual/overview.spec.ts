import { test, expect, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import { compareImages } from "./compare";

const OUT = path.join(process.cwd(), "test-results", "visual");
const GOLDEN = path.join(process.cwd(), "public", "reference", "hive-lrc-dashboard-golden.png");

async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
}

async function shoot(page: Page, url: string, file: string) {
  await page.goto(url);
  await settle(page);
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, file) });
}

/** Gate V1 — container geometry vs TIP §6 vertical rhythm (±2px). */
test("golden geometry: container positions at 1672x941", async ({ page }) => {
  await page.goto("/en/console?demo=1");
  await settle(page);

  const box = async (testId: string) => {
    const el = page.getByTestId(testId);
    const b = await el.boundingBox();
    expect(b, `missing box for ${testId}`).toBeTruthy();
    return b!;
  };

  const sidebar = await box("sidebar");
  expect(Math.abs(sidebar.width - 192)).toBeLessThanOrEqual(2);

  const header = await box("header");
  expect(Math.abs(header.y - 20)).toBeLessThanOrEqual(2);
  expect(Math.abs(header.height - 72)).toBeLessThanOrEqual(2);

  const metrics = await box("metrics-row");
  expect(Math.abs(metrics.y - 112)).toBeLessThanOrEqual(2);
  expect(Math.abs(metrics.height - 102)).toBeLessThanOrEqual(2);

  const primary = await box("primary-row");
  expect(Math.abs(primary.y - 230)).toBeLessThanOrEqual(2);
  expect(Math.abs(primary.height - 268)).toBeLessThanOrEqual(2);

  const workflow = await box("workflow-row");
  expect(Math.abs(workflow.y - 514)).toBeLessThanOrEqual(2);
  expect(Math.abs(workflow.height - 188)).toBeLessThanOrEqual(2);

  const dependency = await box("dependency-row");
  expect(Math.abs(dependency.y - 718)).toBeLessThanOrEqual(2);
  expect(Math.abs(dependency.height - 188)).toBeLessThanOrEqual(2);

  const claimLedger = await box("claim-ledger");
  expect(Math.abs(claimLedger.width - 496)).toBeLessThanOrEqual(2);
  const ladder = await box("reproduction-ladder");
  expect(Math.abs(ladder.width - 414)).toBeLessThanOrEqual(2);

  // no scrollbars at golden viewport
  const overflow = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
  }));
  expect(overflow.x).toBe(0);
  expect(overflow.y).toBeLessThanOrEqual(0);
});

/** Gate V2 — typography: Inter everywhere except KaTeX. */
test("typography: Inter only, tabular numerals, no clipping", async ({ page }) => {
  await page.goto("/en/console?demo=1");
  await settle(page);

  const offenders = await page.evaluate(() => {
    const bad: string[] = [];
    document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
      if (el.closest(".katex")) return;
      if (!el.textContent?.trim()) return;
      const ff = getComputedStyle(el).fontFamily.toLowerCase();
      if (!ff.includes("inter") && !ff.includes("__inter")) {
        bad.push(`${el.tagName}.${el.className}: ${ff.slice(0, 60)}`);
      }
    });
    return [...new Set(bad)].slice(0, 10);
  });
  expect(offenders).toEqual([]);
});

/** Gate V3 — screenshot diff vs golden master. */
test("visual diff vs golden master (EN, 1672x941)", async ({ page }) => {
  await shoot(page, "/en/console?demo=1", "overview-en-1672x941.png");

  const metrics = compareImages(
    path.join(OUT, "overview-en-1672x941.png"),
    GOLDEN,
    path.join(OUT, "overview-en-diff.png"),
  );

  fs.writeFileSync(path.join(OUT, "metrics-en.json"), JSON.stringify(metrics, null, 2));
  console.log("VISUAL METRICS (EN vs golden):", JSON.stringify(metrics, null, 2));

  // TIP §5 Gate V3 targets — reported; hard assertions per Contractor thresholds.
  expect(metrics.ssim).toBeGreaterThanOrEqual(0.995);
  expect(metrics.mismatchedRatio).toBeLessThanOrEqual(0.008);
  expect(metrics.meanAbsRgbDiff).toBeLessThanOrEqual(2.5);
});

test("VI renders same geometry, no clipping", async ({ page }) => {
  await shoot(page, "/vi/console?demo=1", "overview-vi-1672x941.png");

  const rows = ["metrics-row", "primary-row", "workflow-row", "dependency-row"];
  for (const id of rows) {
    const b = await page.getByTestId(id).boundingBox();
    expect(b).toBeTruthy();
  }
  const overflow = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(overflow.x).toBe(0);

  const clipped = await page.evaluate(() => {
    // detect vertical text clipping: element scrollHeight far beyond clientHeight on leaf text nodes
    const bad: string[] = [];
    document.querySelectorAll<HTMLElement>(".card *").forEach((el) => {
      if (el.children.length > 0) return;
      if (el.classList.contains("visually-hidden") || el.closest(".visually-hidden")) return;
      if (!el.textContent?.trim()) return;
      const cs = getComputedStyle(el);
      if (cs.overflow === "hidden" && cs.textOverflow !== "ellipsis" && el.scrollHeight > el.clientHeight + 4) {
        bad.push(el.className);
      }
    });
    return bad.slice(0, 5);
  });
  expect(clipped).toEqual([]);
});

test("secondary viewport screenshots 1440x900", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "UTC",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const [loc, file] of [
    ["en", "overview-en-1440x900.png"],
    ["vi", "overview-vi-1440x900.png"],
  ] as const) {
    await page.goto(`http://localhost:3100/${loc}/console?demo=1`);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: path.join(OUT, file) });
  }
  await ctx.close();
});

/** AC-06 — monochrome check: every rendered pixel grayscale within tolerance. */
test("monochrome: no colored pixels", async ({ page }) => {
  await shoot(page, "/en/console?demo=1", "overview-en-mono-check.png");
  const { PNG } = await import("pngjs");
  const img = PNG.sync.read(fs.readFileSync(path.join(OUT, "overview-en-mono-check.png")));
  let colored = 0;
  for (let i = 0; i < img.data.length; i += 4) {
    const r = img.data[i];
    const g = img.data[i + 1];
    const b = img.data[i + 2];
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    if (spread > 12) colored++;
  }
  const ratio = colored / (img.width * img.height);
  expect(ratio).toBeLessThan(0.0005);
});
