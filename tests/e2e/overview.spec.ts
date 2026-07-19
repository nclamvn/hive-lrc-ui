import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { assertKeyParity } from "../../src/i18n";

test("i18n key parity en/vi", () => {
  expect(() => assertKeyParity()).not.toThrow();
});

test("loads /en/overview without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/en/console?demo=1");
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("claim-ledger")).toBeVisible();
  await expect(page.getByText("VERIFIED-LOCAL")).toBeVisible();
  await expect(page.getByText("SUPPORTED-INTERNAL").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("loads /vi/overview with Vietnamese content and lang attr", async ({ page }) => {
  await page.goto("/vi/console?demo=1");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByText("Sổ mệnh đề")).toBeVisible();
  await expect(page.getByText("ĐÃ KIỂM CHỨNG CỤC BỘ")).toBeVisible();
});

test("locale switch via profile menu", async ({ page }) => {
  await page.goto("/en/console?demo=1");
  await page.getByRole("button", { name: /profile and language/i }).click();
  await page.getByRole("menuitem", { name: "Tiếng Việt" }).click();
  await page.waitForURL(/\/vi\/console/);
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
});

test("root and locale roots redirect to overview", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL(/\/en\/overview/);
  await page.goto("/vi");
  await page.waitForURL(/\/vi\/overview/);
});

test("view-all links reachable", async ({ page }) => {
  await page.goto("/en/console?demo=1");
  await page.getByTestId("claim-ledger").getByRole("link", { name: /view all/i }).click();
  await page.waitForURL(/\/en\/claims/);
  await expect(page.getByRole("heading", { name: "Claim Ledger" })).toBeVisible();
  await page.goBack();
  await page.getByTestId("risk-register").getByRole("link", { name: /view all/i }).click();
  await page.waitForURL(/\/en\/risks/);
  await expect(page.getByRole("heading", { name: "Risk Register" })).toBeVisible();
});

test("keyboard traversal reaches nav, links and graph nodes", async ({ page }) => {
  await page.goto("/en/console?demo=1");
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement?.className ?? "");
  expect(first).toContain("sidebar-item");
  // tab until a graph node receives focus (bounded)
  let found = false;
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const cls = await page.evaluate(() => document.activeElement?.getAttribute("data-node-id"));
    if (cls) {
      found = true;
      break;
    }
  }
  expect(found).toBe(true);
});

test("LaTeX renders via KaTeX, no image formulas", async ({ page }) => {
  await page.goto("/en/console?demo=1");
  await expect(page.locator(".katex").first()).toBeVisible();
  const mathImgs = await page.locator("img[src*='math'], img[alt*='formula']").count();
  expect(mathImgs).toBe(0);
});

test("axe accessibility scan", async ({ page }) => {
  await page.goto("/en/console?demo=1");
  await page.waitForLoadState("networkidle");
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  if (serious.length > 0) {
    console.log(JSON.stringify(serious.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), null, 2));
  }
  expect(serious).toEqual([]);
});
