import { test, expect } from "@playwright/test";

// Exercises the solver against the default mock path (no ANTHROPIC_API_KEY
// required), so CI validates the full SSE → transcript → KaTeX → stage-rail
// flow without spending tokens.

test("solver page renders composer and pipeline rail", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/en/solver");
  await expect(page.getByRole("heading", { name: "Solver" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Solve" })).toBeVisible();
  // S0..S14 rail present.
  await expect(page.getByText("Official problem freeze")).toBeVisible();
  await expect(page.getByText("Publication and postmortem")).toBeVisible();
  expect(errors).toEqual([]);
});

test("solve streams a transcript with rendered LaTeX and advancing stages", async ({
  page,
}) => {
  await page.goto("/en/solver");
  await page
    .locator("textarea.sv-textarea")
    .fill("Prove that $\\sum_{k=1}^n k = \\frac{n(n+1)}{2}$.");
  await page.getByRole("button", { name: "Solve" }).click();

  // Streaming started: a KaTeX node is rendered from the streamed markdown.
  await expect(page.locator(".sv-transcript .katex").first()).toBeVisible({
    timeout: 20_000,
  });
  // A stage heading appears in the streamed solution.
  await expect(
    page.getByRole("heading", { name: /Official problem freeze/ }),
  ).toBeVisible({ timeout: 20_000 });
  // The rail advances: at least one stop reaches active or done.
  await expect(
    page.locator('.sv-rail-item[data-status="active"], .sv-rail-item[data-status="done"]').first(),
  ).toBeVisible({ timeout: 20_000 });
  // Stop control is offered while streaming.
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
});

test("completed solve shows lemma card, verdict, export bar, and saves history", async ({
  page,
}) => {
  await page.goto("/en/solver");
  await page
    .locator("textarea.sv-textarea")
    .fill("Show that $\\sum_{k=1}^n (2k-1) = n^2$.");
  await page.getByRole("button", { name: "Solve" }).click();

  // Lemma card is promoted from the streamed markdown.
  await expect(page.locator(".sv-md .sv-card-lemma").first()).toBeVisible({
    timeout: 30_000,
  });
  // Verifier verdict lands in the ledger.
  await expect(page.locator('.sv-check[data-status="verified"]')).toBeVisible({
    timeout: 30_000,
  });
  // Export bar appears once the solve is done.
  await expect(page.getByRole("button", { name: ".tex" })).toBeVisible({
    timeout: 30_000,
  });
  // The finished solve is auto-saved to history.
  await page.getByRole("button", { name: /History/ }).click();
  await expect(page.locator(".sv-history-item").first()).toBeVisible();
});
