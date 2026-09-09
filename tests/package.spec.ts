import { test, expect } from '@playwright/test';

for (const [theme, mode, color] of [
  ['neutral', 'light', 'rgb(24, 43, 44)'],
  ['neutral', 'dark', 'rgb(240, 246, 245)'],
  ['usr', 'light', 'rgb(0, 42, 89)'],
]) {
  test(`${theme}/${mode}: packed controls, responsive layout and offline interactions`, async ({ page, context }, info) => {
    const external: string[] = [];
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => {
      if (new URL(route.request().url()).hostname !== '127.0.0.1') {
        external.push(route.request().url());
        return route.abort();
      }
      return route.continue();
    });
    await page.goto(`/?theme=${theme}&mode=${mode}`);
    await expect(page.getByTestId('version')).toContainText(info.project.metadata.react);
    await expect(page.locator('main')).toHaveCSS('color', color);
    const select = page.getByLabel('Category', { exact: true });
    await expect(select).toHaveCSS('padding-right', '44px');
    await expect(page.getByRole('button', { name: 'Save document' })).toHaveCSS('width', '44px');
    await expect(page.locator('.civic-chevron')).toBeVisible();
    await page.getByRole('button', { name: 'Review', exact: true }).click();
    await expect(page.getByLabel('Title', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Title', { exact: true })).toHaveAccessibleDescription('Document title Required');
    await select.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(select).toBeFocused();
    await expect(select).toHaveCSS('outline-style', 'solid');
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `artifacts/${info.project.name}-${theme}-${mode}-${width}.png`, fullPage: true });
    }
    await context.setOffline(true);
    await select.selectOption('national');
    await page.getByLabel('Title', { exact: true }).fill('Example');
    await page.getByRole('button', { name: 'Review', exact: true }).click();
    await expect(page.locator('output')).toHaveText('national: Example');
    await page.getByRole('button', { name: 'Save document' }).click();
    await expect(page.getByRole('button', { name: 'Save document' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Download' })).toBeDisabled();
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
    expect(external).toEqual([]);
    expect(errors).toEqual([]);
  });
}
