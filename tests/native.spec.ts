import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

for (const width of [320, 390, 1440]) {
  for (const mode of ['light', 'dark']) {
    test(`plain HTML ${mode} at ${width}px without JavaScript or network`, async ({ page }, testInfo) => {
      const network: string[] = [];
      page.on('request', request => {
        if (/^https?:/.test(request.url())) network.push(request.url());
      });
      await page.route(/^https?:/, route => route.abort());
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(pathToFileURL(resolve('artifacts/native/index.html')).href);
      // WebKit's offline emulation rejects file:// navigation itself. Network
      // routes are blocked above; enable emulation after the local file loads.
      await page.context().setOffline(true);
      await page.locator('main').evaluate((element, value) => element.setAttribute('data-civic-mode', value), mode);
      const region = page.getByRole('combobox', { name: 'Region', exact: true });
      await expect(region).toHaveAccessibleDescription('Reporting area');
      await expect(region).toHaveCSS('appearance', 'auto');
      await expect(region).toHaveCSS('padding-right', '12px');
      await expect(region).toHaveCSS('min-height', '44px');
      await expect(region).toHaveCSS('border-top-style', 'solid');
      await page.keyboard.press('Tab');
      await expect(region).toBeFocused();
      await expect(region).toHaveCSS('outline-width', '3px');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Tab');
      await expect(region).toHaveValue('north');
      await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('North');
      const invalid = page.getByRole('combobox', { name: 'Invalid region', exact: true });
      await expect(invalid).toHaveAccessibleDescription('Select a reporting area');
      await expect(invalid).toHaveCSS('border-top-width', '2px');
      const disabledRegion = page.getByRole('combobox', { name: 'Unavailable region' });
      await expect(disabledRegion).toBeDisabled();
      await expect(disabledRegion).toHaveCSS('background-color', mode === 'light' ? 'rgb(231, 238, 238)' : 'rgb(48, 72, 69)');
      await expect(disabledRegion).toHaveCSS('color', mode === 'light' ? 'rgb(71, 93, 96)' : 'rgb(192, 211, 207)');
      const checkbox = page.getByRole('checkbox', { name: 'Include comparison' });
      await invalid.focus();
      await page.keyboard.press('Tab');
      await expect(checkbox).toBeFocused();
      await page.keyboard.press('Space');
      await expect(checkbox).toBeChecked();
      await expect(checkbox).toHaveCSS('outline-width', '3px');
      const disabledCheckbox = page.getByRole('checkbox', { name: 'Required baseline' });
      await expect(disabledCheckbox).toBeDisabled();
      await expect(disabledCheckbox).toBeChecked();
      await expect(page.getByRole('button', { name: 'Unavailable action' })).toBeDisabled();
      const button = page.getByRole('button', { name: 'Apply', exact: true });
      await page.keyboard.press('Tab');
      await expect(button).toBeFocused();
      const normal = await button.evaluate(element => getComputedStyle(element).backgroundColor);
      await button.hover();
      await expect.poll(() => button.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(normal);
      const table = page.getByRole('table', { name: 'Regional totals' });
      await expect(table.getByRole('columnheader')).toHaveCount(3);
      await expect(table.getByRole('rowheader')).toHaveCount(1);
      const scroll = page.getByRole('region', { name: 'Regional totals' });
      await scroll.focus();
      await expect(scroll).toHaveCSS('outline-width', '3px');
      if (width < 900) {
        await page.keyboard.press('ArrowRight');
        await expect.poll(() => scroll.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('script').count()).toBe(0);
      expect(network).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath(`native-${mode}-${width}.png`), fullPage: true });
    });
  }
}
