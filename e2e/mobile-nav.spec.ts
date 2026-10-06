import { expect, test, type Page } from "@playwright/test";

const LOCALES = ["ar", "en", "de"] as const;
const NAMES = { ar: "العربية", en: "English", de: "Deutsch" };

const bar = (page: Page) => page.locator("header .container-site").first();
const join = (page: Page) => bar(page).locator('a[href*="#join"]');
const langButton = (page: Page) => bar(page).locator('button[aria-haspopup="menu"]');
const menuButton = (page: Page) => bar(page).locator("button[aria-expanded]:not([aria-haspopup])");
const picker = (page: Page) => page.getByRole("menu");

for (const locale of LOCALES) {
  test.describe(`/${locale}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}`);
    });

    test("top bar fits on one line: logo, Join, language, menu", async ({ page }) => {
      const items = [
        bar(page).locator("a").first(),
        join(page),
        langButton(page),
        menuButton(page),
      ];
      const boxes: { x: number; y: number; width: number; height: number }[] = [];
      for (const item of items) {
        await expect(item).toBeVisible();
        boxes.push((await item.boundingBox())!);
      }
      const width = page.viewportSize()!.width;
      const mid = (b: (typeof boxes)[number]) => b.y + b.height / 2;

      for (const b of boxes) {
        expect(b.x).toBeGreaterThanOrEqual(0);
        expect(b.x + b.width).toBeLessThanOrEqual(width);
        expect(Math.abs(mid(b) - mid(boxes[0]))).toBeLessThan(2); // same row
      }
      // No horizontal page scroll.
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );

      // Reading order Join → language → menu (mirrored in RTL).
      const [, j, l, m] = boxes;
      if (locale === "ar") {
        expect(m.x + m.width).toBeLessThanOrEqual(l.x);
        expect(l.x + l.width).toBeLessThanOrEqual(j.x);
      } else {
        expect(j.x + j.width).toBeLessThanOrEqual(l.x);
        expect(l.x + l.width).toBeLessThanOrEqual(m.x);
      }
    });

    test("language button is a 44px tap target", async ({ page }) => {
      const b = (await langButton(page).boundingBox())!;
      expect(b.height).toBeGreaterThanOrEqual(44);
      expect(b.width).toBeGreaterThanOrEqual(44);
    });

    test("picker opens on screen with the current language checked", async ({ page }) => {
      await langButton(page).tap();
      await expect(picker(page)).toBeVisible();

      const items = picker(page).getByRole("menuitemradio");
      await expect(items).toHaveCount(3);
      await expect(picker(page).getByRole("menuitemradio", { checked: true })).toHaveText(
        NAMES[locale],
      );

      const b = (await picker(page).boundingBox())!;
      const v = page.viewportSize()!;
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(v.width);
      expect(b.y + b.height).toBeLessThanOrEqual(v.height);

      // The ⋯ menu stays closed: this is its own picker.
      await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
    });

    test("picker closes on Esc and on an outside tap", async ({ page }) => {
      await langButton(page).tap();
      await expect(picker(page)).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(picker(page)).toBeHidden();

      await langButton(page).tap();
      await expect(picker(page)).toBeVisible();
      await page.mouse.click(10, page.viewportSize()!.height - 10);
      await expect(picker(page)).toBeHidden();
    });

    test("menu holds only the section links", async ({ page }) => {
      await menuButton(page).tap();
      await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
      const menu = page.locator(`#${await menuButton(page).getAttribute("aria-controls")}`);
      await expect(menu.getByRole("link")).toHaveCount(4);
      await expect(menu.locator('button[aria-haspopup="menu"]')).toHaveCount(0);
    });
  });
}

test("choosing a language keeps the section", async ({ page }) => {
  await page.goto("/en#faq");
  await langButton(page).tap();
  await picker(page).getByRole("menuitemradio", { name: "Deutsch" }).tap();
  await expect(page).toHaveURL(/\/de#faq$/);
  await expect(picker(page)).toBeHidden();
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
});
