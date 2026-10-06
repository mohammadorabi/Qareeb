import { expect, test } from "@playwright/test";

const LOCALES = ["ar", "en", "de"] as const;
const WIDTHS = [360, 375, 390, 414];

// The step cards below 1024px: each must show its whole phone, never cropped.
for (const locale of LOCALES) {
  for (const width of WIDTHS) {
    test(`/${locale} at ${width}px: step cards show the whole phone`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`/${locale}`);
      const cards = page.locator("ol.lg\\:hidden > li");
      await expect(cards).toHaveCount(3);

      for (let i = 0; i < 3; i++) {
        const card = cards.nth(i);
        await card.scrollIntoViewIfNeeded();
        const c = (await card.boundingBox())!;
        const p = (await card.locator(".phone").boundingBox())!;

        // Inside the card, with ~24px below it.
        expect(p.x).toBeGreaterThanOrEqual(c.x);
        expect(p.x + p.width).toBeLessThanOrEqual(c.x + c.width);
        expect(p.y + p.height).toBeLessThanOrEqual(c.y + c.height);
        expect(c.y + c.height - (p.y + p.height)).toBeGreaterThanOrEqual(23);

        // Same size as before (266px wide), real iPhone proportions.
        expect(Math.round(p.width)).toBe(266);
        expect(p.height / p.width).toBeGreaterThan(2);

        // Tab bar or bottom sheet, and the home indicator, inside the phone screen.
        const screen = (await card.locator(".phone-screen").boundingBox())!;
        for (const sel of [".phone-home", ".phone-ui .z-20"]) {
          const b = (await card.locator(sel).first().boundingBox())!;
          expect(b.y + b.height).toBeLessThanOrEqual(screen.y + screen.height + 0.5);
          expect(b.y).toBeGreaterThan(screen.y + screen.height / 2);
        }
      }

      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    });
  }
}
