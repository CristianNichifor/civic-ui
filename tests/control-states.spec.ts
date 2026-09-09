import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/?edge=1');
});

test('disabled controls cannot be edited or activated and are skipped by Tab', async ({ page }) => {
  const input = page.getByLabel('Disabled input', { exact: true });
  const select = page.getByLabel('Disabled select', { exact: true });
  const button = page.getByRole('button', { name: 'Disabled action', exact: true });
  await expect(input).toBeDisabled();
  await expect(select).toBeDisabled();
  await expect(button).toBeDisabled();
  await button.evaluate((element: HTMLButtonElement) => element.click());
  await expect(page.getByTestId('edge-actions')).toHaveText('0');
  await expect(input).toHaveValue('Fixed');
  await expect(select).toHaveValue('fixed');
  await page.getByRole('button', { name: 'Save document' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Required category', { exact: true })).toBeFocused();
});

test('invalid native select associates its error and clears validity after selection', async ({ page }) => {
  const select = page.getByLabel('Required category', { exact: true });
  await expect(select).toHaveAttribute('aria-invalid', 'true');
  await expect(select).toHaveAccessibleDescription('Choose a category Category is required');
  await expect(select).toHaveJSProperty('willValidate', true);
  expect(await select.evaluate((element: HTMLSelectElement) => element.validity.valueMissing)).toBe(true);
  await select.selectOption('chosen');
  await expect(select).not.toHaveAttribute('aria-invalid');
  await expect(select).toHaveAccessibleDescription('Choose a category');
  await expect(page.locator('#invalid-select-error')).toHaveCount(0);
  expect(await select.evaluate((element: HTMLSelectElement) => element.validity.valid)).toBe(true);
});

test('long field labels, options and action text stay inside narrow layouts', async ({ page }, info) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const select = page.locator('#long-select');
    await expect(select).toHaveCSS('padding-right', '44px');
    for (const target of [page.locator('label[for="long-select"]'), select, page.getByRole('button', { name: 'Continue with' })]) {
      const bounds = await target.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
    await page.screenshot({ path: `artifacts/${info.project.name}-long-${width}.png`, fullPage: true });
  }
});

test('keyboard focus follows native controls and activates the icon button', async ({ page }) => {
  const title = page.getByLabel('Title', { exact: true });
  await title.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Category', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Review', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  const save = page.getByRole('button', { name: 'Save document' });
  await expect(save).toBeFocused();
  await expect(save).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Space');
  await expect(save).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Review', exact: true })).toBeFocused();
});
