import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('showcase themes, control states and layouts', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/showcase.html');
  await expect(page.getByRole('heading', { name: 'Civic UI', exact: true })).toBeVisible();
  await expect(page.locator('.version')).toContainText(info.project.metadata.react);
  for (const theme of ['light', 'dark', 'usr']) {
    if (theme === 'usr') await page.getByLabel('USR host tokens', { exact: true }).check();
    else await page.getByLabel(theme === 'light' ? 'Light' : 'Dark', { exact: true }).check();
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.getByLabel('Category', { exact: true })).toHaveCSS('padding-right', '44px');
      await expect(page.getByLabel('Disabled input', { exact: true })).toBeDisabled();
      await expect(page.getByLabel('Disabled select', { exact: true })).toBeDisabled();
      await expect(page.getByLabel('Read-only input', { exact: true })).toHaveAttribute('readonly');
      await expect(page.getByLabel('Required title', { exact: true })).toHaveAttribute('aria-invalid', 'true');
      await page.screenshot({ path: `artifacts/showcase-${info.project.name}-${theme}-${width}.png`, fullPage: true });
    }
  }
  await expect(page.getByLabel('Dark', { exact: true })).toBeDisabled();
  await expect(page.locator('.showcase')).toHaveCSS('color', 'rgb(0, 42, 89)');
  expect(errors).toEqual([]);
});

test('showcase keyboard and offline interactions remain local', async ({ page, context, baseURL }) => {
  const external: string[] = [];
  await context.route('**/*', route => {
    const url = route.request().url();
    if (/^https?:/.test(url) && new URL(url).origin !== new URL(baseURL!).origin) { external.push(url); return route.abort(); }
    return route.continue();
  });
  await page.goto('/showcase.html');
  await context.setOffline(true);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to controls' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#controls')).toBeFocused();
  await page.getByLabel('Title', { exact: true }).focus();
  await page.keyboard.press('Tab');
  const select = page.getByLabel('Category', { exact: true });
  await expect(select).toBeFocused();
  await expect(select).toHaveCSS('outline-style', 'solid');
  await expect(select).toHaveAccessibleDescription('Document category Category is required');
  await select.selectOption('local');
  await expect(select).not.toHaveAttribute('aria-invalid');
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('Reviews: 1', { exact: true })).toBeVisible();
  const save = page.getByRole('button', { name: 'Save document', exact: true });
  await save.focus(); await page.keyboard.press('Space');
  await expect(save).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(save).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByText('Reviews: 0', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  expect(external).toEqual([]);
});

test('examples copy or report clipboard failure and download the displayed source', async ({ page }) => {
  await page.goto('/showcase.html');
  await page.getByText('Fields example', { exact: true }).click();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { document.documentElement.dataset.copied = text; } } }));
  await page.getByRole('button', { name: 'Copy Fields example' }).click();
  await expect(page.getByText('Copied', { exact: true })).toBeVisible();
  const source = await page.getByLabel('Fields source').innerText();
  expect(await page.evaluate(() => document.documentElement.dataset.copied)).toBe(source);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } }));
  await page.getByRole('button', { name: 'Copy Fields example' }).click();
  await expect(page.getByText('Clipboard unavailable', { exact: true })).toBeVisible();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Fields example' }).click();
  const download = await pending;
  expect(await readFile((await download.path())!, 'utf8')).toBe(source);
  await page.setViewportSize({ width: 320, height: 1000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
