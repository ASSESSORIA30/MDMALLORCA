import { test, expect } from "@playwright/test";
test("buyer can explore residence, showroom, comparison and contact without errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { name: "Your place in Mallorca." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Discover the residences", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/residences$/);
  await page
    .getByRole("link", { name: "Explore the residence", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Son Oliva", exact: true }),
  ).toBeVisible();
  for (const name of [
    "Film",
    "3D architecture",
    "360° tour",
    "Floor plans",
    "Location",
  ]) {
    await page.getByRole("tab", { name, exact: true }).click();
    await expect(page.getByRole("tabpanel")).toBeVisible();
  }
  await page.getByRole("tab", { name: "Gallery", exact: true }).click();
  await page.getByRole("button", { name: "Full screen", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog")).toContainText("1/1");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const slider = page.getByRole("slider");
  await slider.fill("75");
  await expect(slider).toHaveValue("75");
  await page
    .getByRole("link", { name: "Arrange a private presentation", exact: true })
    .first()
    .click();
  await page.getByLabel("Full name", { exact: true }).fill("Test Person");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Phone with country code").fill("+34 600 000 000");
  await page.getByLabel("Residence of interest").selectOption("son-oliva");
  await page
    .getByLabel("Your message")
    .fill("I would like a private presentation.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send private enquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "No information has been sent or stored",
  );
  expect(errors).toEqual([]);
});
for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 820, height: 1180 },
  { width: 390, height: 844 },
]) {
  test(`responsive ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map(async (img) => {
          img.loading = "eager";
          try {
            await img.decode();
          } catch {}
        }),
      );
    });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/modulardom-${viewport.width}.png`,
      fullPage: true,
    });
    if (viewport.width < 720) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "The residences", exact: true })
        .click();
      await expect(page).toHaveURL(/\/en\/residences$/);
    }
    await page.getByRole("link", { name: "ES", exact: true }).click();
    await expect(page).toHaveURL(/\/es/);
    await page.getByRole("link", { name: "CA", exact: true }).click();
    await expect(page).toHaveURL(/\/ca/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
test("unknown residence, private admin, international SEO and enquiry validation", async ({
  request,
}) => {
  expect((await request.get("/en/residences/unknown")).status()).toBe(404);
  expect((await request.get("/admin")).status()).toBe(404);
  const html = await (await request.get("/es")).text();
  expect(html).toContain('hrefLang="ca"');
  expect(html).toContain('lang="es"');
  expect((await request.post("/api/enquiries", { data: {} })).status()).toBe(
    400,
  );
  expect(
    (
      await request.post("/api/enquiries", {
        headers: { origin: "https://evil.invalid" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});

test("public pages have no serious accessibility violations", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/en", "/es/contact", "/ca/residences/son-oliva"]) {
    await page.goto(route);
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      report.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
