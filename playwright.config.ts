import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3100",
    viewport: { width: 1672, height: 941 },
    deviceScaleFactor: 1,
    locale: "en-US",
    timezoneId: "UTC",
    contextOptions: { reducedMotion: "reduce" },
  },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100/en/overview?demo=1",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
