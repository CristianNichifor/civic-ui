import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/showcase.html");
});

test("native choices and validation links retain form semantics", async ({
  page,
}) => {
  const route = page.url();
  await page.getByRole("link", { name: "Add notes before continuing" }).click();
  const notes = page.getByRole("textbox", { name: "Notes", exact: true });
  expect(page.url()).toBe(route);
  await expect(notes).toHaveCSS("border-top-width", "2px");
  await expect(page.getByLabel("Category", { exact: true })).toHaveCSS(
    "border-top-width",
    "2px",
  );
  await expect(notes).toBeFocused();
  await expect(notes).toHaveAccessibleDescription("Notes are required");
  await notes.fill("Synthetic notes");
  await expect(notes).not.toHaveAttribute("aria-invalid");
  await expect(page.getByRole("alert")).toHaveCount(0);
  const checkbox = page.getByRole("checkbox", { name: "Include attachments" });
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Restricted attachment" }),
  ).toBeDisabled();
  const group = page.getByRole("group", { name: "Visibility" });
  await group.getByLabel("Public", { exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(group.getByLabel("Draft", { exact: true })).toBeChecked();
  await expect(group.getByLabel("Restricted", { exact: true })).toBeDisabled();
  await page.keyboard.press("ArrowLeft");
  await expect(group.getByLabel("Public", { exact: true })).toBeChecked();
});

test("range and segmented controls keep native form semantics", async ({ page }) => {
  const slider = page.getByRole("slider", { name: "Preview zoom" });
  await expect(slider).toHaveValue("50");
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("55");
  await expect(page.getByText("55", { exact: true })).toBeVisible();
  const density = page.getByRole("group", { name: "View density" });
  await expect(density.getByRole("radio", { name: "Comfortable" })).toBeChecked();
  await density.getByText("Compact", { exact: true }).click();
  await expect(density.getByRole("radio", { name: "Compact" })).toBeChecked();
});

test("dialog traps focus, escapes and restores trigger focus", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Edit document",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Edit document",
    exact: true,
  });
  await expect(dialog).toHaveAccessibleDescription(
    "Synthetic document settings",
  );
  await expect(dialog.getByLabel("Document name")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByLabel("Document name")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("alert dialog defaults to cancel and requires explicit confirmation", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Archive document",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("alertdialog", { name: "Archive document?" });
  await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.locator(".civic-overlay").click({ position: { x: 1, y: 1 } });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(
    page.getByText("Document archived", { exact: true }),
  ).toHaveCount(0);
  await trigger.click();
  await dialog.getByRole("button", { name: "Archive", exact: true }).click();
  await expect(
    page.getByText("Document archived", { exact: true }),
  ).toBeVisible();
});

test("menu skips disabled actions and tooltip supports keyboard dismissal", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Document actions" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Edit metadata" }),
  ).toBeFocused();
  await expect(
    page.getByRole("menuitem", { name: "Delete document" }),
  ).toHaveAttribute("data-disabled");
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Duplicate document" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Duplicate selected", { exact: true }),
  ).toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Help", exact: true }).focus();
  await expect(page.getByRole("tooltip")).toHaveText("Document help");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("tabs, caller-owned sorting and pagination preserve rows", async ({
  page,
}) => {
  const table = page.getByRole("table");
  await expect(table.locator("tbody tr")).toHaveText([
    "ArchivePublic",
    "BudgetPublic",
  ]);
  await expect(
    page.getByRole("button", { name: "Previous page" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(table.locator("tbody tr")).toHaveText([
    "ConsultationPublic",
    "DocumentsPublic",
  ]);
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  await page.getByRole("button", { name: "Document", exact: true }).click();
  await expect(
    table.getByRole("columnheader", { name: "Document" }),
  ).toHaveAttribute("aria-sort", "descending");
  await expect(table.locator("tbody tr")).toHaveText([
    "DocumentsPublic",
    "ConsultationPublic",
  ]);
  await page.getByRole("tab", { name: "Documents", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Saved", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveText("No saved items");
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Documents", exact: true }),
  ).toBeFocused();
});

test("filter toolbar exposes fields, result count and actions", async ({ page }) => {
  const toolbar = page.getByRole("group", { name: "Archive filters" });
  await expect(toolbar.getByRole("textbox", { name: "Search archive" })).toBeVisible();
  await expect(toolbar.getByRole("combobox", { name: "Visibility filter" })).toBeVisible();
  await expect(toolbar).toContainText("4 documents");
  await expect(toolbar.getByRole("button", { name: "Apply filters" })).toBeVisible();
});

test("shared primitives expose semantic surfaces and loading contracts", async ({ page }) => {
  await page.getByRole("link", { name: "Shared primitives", exact: true }).click();
  const card = page.locator(".civic-card").first();
  await expect(card).toContainText("Semantic surfaces keep content and actions caller-owned.");
  await expect(card.getByRole("progressbar", { name: "Indexing documents" })).toHaveAttribute("value", "62");
  const loadingCard = page.locator("section.civic-card");
  await expect(loadingCard).toContainText("Loading preview");
  await expect(page.getByText("Loading document preview")).toHaveCSS("position", "absolute");
  await expect(page.locator(".showcase-skeleton")).toHaveAttribute("aria-hidden", "true");
});

test("overlay themes and mobile bounds work offline with reduced motion", async ({
  page,
  context,
}, info) => {
  const operation = page.locator('.civic-operation-status[data-state="loading"]');
  await expect(operation).toContainText("Updating archive");
  await expect(operation.locator("progress")).toHaveAttribute("value", "62");
  await context.setOffline(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".civic-loading svg")).toHaveCSS(
    "animation-name",
    "none",
  );
  for (const theme of ["light", "dark", "usr"]) {
    await page
      .getByLabel(
        theme === "usr"
          ? "USR host tokens"
          : theme === "dark"
            ? "Dark"
            : "Light",
        { exact: true },
      )
      .check();
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page
        .getByRole("button", { name: "Edit document", exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      const rect = await dialog.boundingBox();
      expect(rect!.x).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
      expect(await dialog.evaluate((el) => getComputedStyle(el).color)).toBe(
        await page
          .locator(".showcase")
          .evaluate((el) => getComputedStyle(el).color),
      );
      await page.screenshot({
        path: `artifacts/dialog-${info.project.name}-${theme}-${width}.png`,
      });
      await page.keyboard.press("Escape");
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});

test("explicit portals escape transformed containers and retain their host theme", async ({
  page,
}) => {
  await page.goto("/showcase.html?portal=1");
  await page.getByLabel("Dark", { exact: true }).check();
  await page.setViewportSize({ width: 320, height: 900 });
  await page.locator("#overlays").evaluate((el) => {
    el.style.transform = "translateZ(0)";
    el.style.overflow = "hidden";
  });
  const host = page.locator("#overlay-host");
  await page
    .getByRole("button", { name: "Edit document", exact: true })
    .click();
  await expect(host.getByRole("dialog")).toBeVisible();
  await expect(host.getByRole("dialog")).toHaveCSS(
    "color",
    await page
      .locator(".showcase")
      .evaluate((el) => getComputedStyle(el).color),
  );
  await page.keyboard.press("Escape");
  await expect(host.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Edit document", exact: true })).toBeFocused();
  await page
    .getByRole("button", { name: "Archive document", exact: true })
    .click();
  await expect(host.getByRole("alertdialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(host.getByRole("alertdialog")).toHaveCount(0);
  // Radix restores focus asynchronously; wait before focusing the next trigger.
  await expect(page.getByRole("button", { name: "Archive document", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Help", exact: true }).focus();
  await expect(page.getByRole("button", { name: "Help", exact: true })).toBeFocused();
  await expect(host.getByRole("tooltip")).toHaveText("Document help");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Document actions" }).focus();
  await page.keyboard.press("ArrowDown");
  const item = host.getByRole("menuitem", { name: "Edit metadata" });
  await expect(item).toBeFocused();
  await expect(item).toHaveCSS(
    "background-color",
    await page
      .locator("#buttons .civic-button--primary")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Document actions" }),
  ).toBeFocused();
});
