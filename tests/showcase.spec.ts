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

test('showcase header, numbering and navigation match the package', async ({ page }) => {
  const { version } = JSON.parse(await readFile('package.json', 'utf8'));
  await page.goto('/showcase.html');
  await expect(page.locator('.version')).toContainText(`v${version}`);
  await expect(page.locator('.version')).not.toContainText('preview');
  const numbers = await page.locator('.section-title > span').allTextContents();
  expect(numbers).toEqual(numbers.map((_, i) => String(i + 1).padStart(2, '0')));
  const ids = await page.locator('main > section[id], main section[id]').evaluateAll(sections =>
    sections.filter(section => section.querySelector(':scope > .section-title')).map(section => section.id));
  const nav = page.getByRole('navigation', { name: 'Reference' });
  for (const id of ids) await expect(nav.locator(`a[href="#${id}"]`)).toHaveCount(1);
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('language toggle applies the Romanian preset', async ({ page }) => {
  await page.goto('/showcase.html');
  await expect(page.getByRole('button', { name: 'Previous page', exact: true })).toBeVisible();
  await page.getByRole('group', { name: 'Language' }).getByLabel('Română').check();
  await expect(page.locator('.showcase')).toHaveAttribute('lang', 'ro');
  await expect(page.getByRole('button', { name: 'Pagina anterioară', exact: true })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Archive filters' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reîncercați', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit document', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Închideți dialogul' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('group', { name: 'Language' }).getByLabel('English').check();
  await expect(page.getByRole('button', { name: 'Previous page', exact: true })).toBeVisible();
});

test('new components document their props', async ({ page }) => {
  await page.goto('/showcase.html');
  for (const name of ['StatusMessage', 'FilterToolbar', 'Table', 'SiteShell', 'StatTile', 'ChartFrame', 'SourceCitation']) {
    await page.getByText(`${name} props`, { exact: true }).click();
    const table = page.getByRole('table', { name: `${name} props` });
    await expect(table.getByRole('columnheader')).toHaveText(['Prop', 'Type', 'Default', 'Description']);
    await expect(table.locator('tbody tr').first()).toBeVisible();
  }
});

test('site and data section shows tiles, a framed chart and the shell example', async ({ page }) => {
  await page.goto('/showcase.html');
  const section = page.locator('#site-data');
  await expect(section.getByRole('list', { name: 'Archive figures' }).getByRole('listitem')).toHaveCount(3);
  await expect(section.getByRole('figure', { name: 'Documents by status' })).toBeVisible();
  await expect(section.getByRole('link', { name: 'Open the site shell example' })).toHaveAttribute('href', 'site.html');
  await page.getByRole('group', { name: 'Language' }).getByLabel('Română').check();
  await expect(section.getByRole('button', { name: 'Afișează ca tabel' })).toBeVisible();
});
