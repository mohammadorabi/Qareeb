import { defineConfig, devices } from "@playwright/test";

/** Mobile tests: run with `npm run test:mobile` (starts `next dev` unless one is already on :3000). */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    // The narrowest common Android width.
    {
      name: "android-360",
      use: { ...devices["Galaxy S9+"], viewport: { width: 360, height: 740 } },
    },
    {
      name: "iphone-375",
      use: { ...devices["iPhone SE (3rd gen)"] },
    },
    { name: "pixel-7", use: { ...devices["Pixel 7"] } },
    { name: "iphone-14", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/en",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
