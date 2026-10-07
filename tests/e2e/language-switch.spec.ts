import { expect, test, type Locator, type Page } from "@playwright/test";

type Locale = "ar" | "en" | "de";
const NAMES: Record<Locale, string> = { ar: "العربية", en: "English", de: "Deutsch" };
const PAIRS: [Locale, Locale][] = [
  ["en", "de"],
  ["de", "ar"],
  ["ar", "en"],
  ["en", "ar"],
  ["ar", "de"],
];

const langButton = (page: Page) =>
  page.locator('header .container-site button[aria-haspopup="menu"]').first();

async function open(page: Page, locale: Locale) {
  await page.goto(`/${locale}`);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts.ready);
}

/**
 * Click where the element is, like a finger tap. locator.click() first scrolls
 * the element "into view", and with scroll-padding-top it scrolls the page to
 * reveal the sticky nav, which a real tap never does.
 */
async function tap(page: Page, locator: Locator) {
  await expect(locator).toBeVisible();
  const box = (await locator.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

async function openPicker(page: Page) {
  await tap(page, langButton(page));
  await expect(page.getByRole("menu")).toBeVisible();
}

async function switchTo(page: Page, to: Locale) {
  await openPicker(page);
  await tap(page, page.getByRole("menu").getByRole("menuitemradio", { name: NAMES[to] }));
  await page.waitForURL((url) => url.pathname === `/${to}`);
  await expect(page.locator("html")).toHaveAttribute("lang", to);
}

/** window.scrollY every 100ms for `ms`. */
function sampleScroll(page: Page, ms = 2000) {
  return page.evaluate(
    (ms) =>
      new Promise<number[]>((resolve) => {
        const out: number[] = [];
        const id = setInterval(() => out.push(window.scrollY), 100);
        setTimeout(() => {
          clearInterval(id);
          resolve(out);
        }, ms);
      }),
    ms,
  );
}

async function navBottom(page: Page) {
  return page.evaluate(() => document.querySelector("header")!.getBoundingClientRect().bottom);
}

async function sectionTop(page: Page, id: string) {
  return page.evaluate((id) => document.getElementById(id)!.getBoundingClientRect().top, id);
}

for (const [from, to] of PAIRS) {
  test.describe(`${from} → ${to}`, () => {
    test("from the top: clean URL, stays at the top", async ({ page }) => {
      await open(page, from);
      await switchTo(page, to);

      expect(new URL(page.url()).pathname + new URL(page.url()).hash).toBe(`/${to}`);
      const samples = await sampleScroll(page);
      expect(Math.max(...samples), `scrollY samples: ${samples.join(",")}`).toBeLessThanOrEqual(5);
      await expect(page.locator("#hero-title")).toBeInViewport();
    });

    test("from #services: lands on #services, no second jump", async ({ page }) => {
      await open(page, from);
      // Align #services under the nav, again once lazy content above has settled.
      for (let i = 0; i < 2; i++) {
        await page.evaluate(() => {
          const nav = document.querySelector("header")!.getBoundingClientRect().height;
          const top = document.getElementById("services")!.getBoundingClientRect().top;
          window.scrollTo({ top: window.scrollY + top - nav, behavior: "instant" });
        });
        await page.waitForTimeout(500);
      }
      expect(Math.abs((await sectionTop(page, "services")) - (await navBottom(page)))).toBeLessThan(
        40,
      );
      await switchTo(page, to);

      await expect(page).toHaveURL(new RegExp(`/${to}#services$`));
      // First stable frame, then nothing may move.
      await expect
        .poll(async () => Math.abs((await sectionTop(page, "services")) - (await navBottom(page))))
        .toBeLessThanOrEqual(40);
      const samples = await sampleScroll(page);
      const drift = Math.max(...samples) - Math.min(...samples);
      expect(drift, `scrollY samples: ${samples.join(",")}`).toBeLessThanOrEqual(5);
    });

    test("picker closes and checks the new language", async ({ page }) => {
      await open(page, from);
      await switchTo(page, to);
      await expect(page.getByRole("menu")).toHaveCount(0);
      await openPicker(page);
      const checked = page.getByRole("menuitemradio", { checked: true });
      await expect(checked).toHaveCount(1);
      await expect(checked).toHaveAttribute("hreflang", to);
    });
  });
}

test.describe("in-page links still scroll smoothly", () => {
  /** True if scrollY passes through intermediate values on its way to the target. */
  async function scrollsSmoothly(page: Page, click: () => Promise<void>, id: string) {
    const watch = page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const out: number[] = [];
          const tick = () => {
            out.push(window.scrollY);
            if (out.length < 90) requestAnimationFrame(tick);
            else resolve(out);
          };
          requestAnimationFrame(tick);
        }),
    );
    await click();
    const ys = await watch;
    const distinct = new Set(ys.filter((y) => y > 0)).size;
    expect(distinct, `expected a smooth animation, got ${ys.join(",")}`).toBeGreaterThan(2);
    await expect
      .poll(async () => Math.abs((await sectionTop(page, id)) - (await navBottom(page))))
      .toBeLessThanOrEqual(40);
  }

  test("scroll cue", async ({ page }) => {
    await open(page, "en");
    await scrollsSmoothly(
      page,
      () => page.getByRole("link", { name: "Discover the story" }).click(),
      "why",
    );
  });

  test("nav link", async ({ page }) => {
    await open(page, "en");
    const desktop = page.viewportSize()!.width >= 1024;
    if (!desktop) await page.locator("header button[aria-controls]:not([aria-haspopup])").click();
    const link = page
      .locator(`header nav${desktop ? ".hidden" : ""} a[href$="#services"]`)
      .filter({ visible: true })
      .first();
    await scrollsSmoothly(page, () => link.click(), "services");
  });
});
