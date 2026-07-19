import { test, expect } from "@playwright/test";

test("observatory overview loads without console errors + honest KPI split", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  await page.goto("/en/observatory");
  await page.waitForLoadState("networkidle");
  // two-KPI split: independent reproduction vs internal structural result
  await expect(page.getByText("k = 9")).toBeVisible();
  await expect(page.getByText("LRC(13)").first()).toBeVisible();
  // standing disclaimer must be present in the footer on every public page
  // (the phrase also legitimately appears in D18 gate/release content, so scope to the footer)
  await expect(page.locator("footer.og-footer").getByText("LRC(13) remains open.")).toBeVisible();
  expect(errors).toEqual([]);
});

test("no public page reads as 'LRC(13) solved'", async ({ page }) => {
  for (const r of ["/en/observatory", "/en/observatory/claims", "/en/observatory/journal", "/en/observatory/about"]) {
    await page.goto(r);
    const body = (await page.textContent("body")) ?? "";
    expect(body).not.toMatch(/LRC\s*\(?13\)?\s*(is\s+)?(solved|proved|proven|settled)/i);
    expect(body).toContain("LRC(13) remains open.");
  }
});

test("superseded claim links to its successor", async ({ page }) => {
  await page.goto("/en/observatory/claims/C-D15-SUPPORT3-INVENTORY");
  await expect(page.getByText("superseded by", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "C-D16-SUPPORT3-COMPLETE" })).toBeVisible();
});

test("research map renders an interactive canvas with painted nodes", async ({ page }) => {
  await page.goto("/en/observatory/map");
  await expect(page.getByRole("application", { name: "Research attack map" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Focus mode" })).toBeVisible();
  // cytoscape injects <canvas> layers into the container once the graph mounts + lays out
  const cnv = page.locator(".rm-canvas svg").first();
  await expect(cnv).toBeVisible({ timeout: 10000 });
  const painted = await page.evaluate(() => {
    const c = document.querySelector(".rm-canvas svg"); return !!c;
  });
  expect(painted).toBe(true);
});

test("/observatory redirects to the golden /overview home", async ({ page }) => {
  await page.goto("/en/observatory");
  await page.waitForURL(/\/en\/overview/);
  await expect(page.getByText("k = 9")).toBeVisible();
});

test("VI locale renders the observatory", async ({ page }) => {
  await page.goto("/vi/observatory");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator("footer.og-footer").getByText("LRC(13) vẫn mở.")).toBeVisible();
});

test("gate detail page shows honest status + no public claim", async ({ page }) => {
  await page.goto("/en/observatory/gates/gate-d16");
  await expect(page.getByText("Public claim", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Modular/i })).toBeVisible();
});
