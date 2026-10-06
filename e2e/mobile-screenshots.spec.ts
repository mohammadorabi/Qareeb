import { test } from "@playwright/test";

// Not assertions: saves what each phone shows to screenshots/<device>/ and
// attaches it to the HTML report (`npx playwright show-report`).

const LOCALES = ["ar", "en", "de"] as const;

for (const locale of LOCALES) {
  test(`screenshots /${locale}`, async ({ page }, testInfo) => {
    const dir = `screenshots/${testInfo.project.name}`;
    const shot = async (name: string, clipHeight?: number) => {
      const width = page.viewportSize()!.width;
      const body = await page.screenshot({
        path: `${dir}/${locale}-${name}.png`,
        clip: clipHeight ? { x: 0, y: 0, width, height: clipHeight } : undefined,
      });
      await testInfo.attach(`${locale}-${name}`, { body, contentType: "image/png" });
    };

    await page.goto(`/${locale}`);
    await page.waitForLoadState("networkidle");
    await shot("screen");
    await shot("nav", 72);

    await page.locator('header button[aria-haspopup="menu"]').first().tap();
    await page.getByRole("menu").waitFor();
    await page.waitForTimeout(300); // let the fade-in finish
    await shot("picker", 280);
    await page.keyboard.press("Escape");

    await page.locator("header button[aria-expanded]:not([aria-haspopup])").tap();
    await shot("menu", 360);
  });
}
