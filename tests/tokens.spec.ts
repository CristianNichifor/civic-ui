import { expect, test } from '@playwright/test';

const tokens = ['--civic-success', '--civic-on-success', '--civic-warning', '--civic-info', '--civic-on-danger',
  '--civic-space-8', '--civic-text-3xl', '--civic-weight-heading', '--civic-viz-1', '--civic-viz-8',
  '--civic-viz-seq-7', '--civic-viz-div-mid'];

test('tokens resolve in every theme and existing control sizes are unchanged', async ({ page }) => {
  await page.goto('/showcase.html');
  for (const theme of ['Light', 'Dark', 'USR host tokens']) {
    await page.getByLabel(theme, { exact: true }).check();
    const values = await page.locator('.showcase').evaluate((el, names) =>
      names.map(name => getComputedStyle(el).getPropertyValue(name).trim()), tokens);
    values.forEach((value, i) => expect(value, `${theme} ${tokens[i]}`).not.toBe(''));
  }
  await expect(page.locator('.civic-field label').first()).toHaveCSS('font-size', '14px');
  await expect(page.locator('.civic-badge').first()).toHaveCSS('font-size', '13px');
});

test('host token diagnostics', async ({ page }) => {
  await page.goto('/showcase.html');
  const report = page.getByTestId('token-report');
  for (const theme of ['Neutral', 'USR host tokens']) {
    await page.getByLabel(theme, { exact: true }).check();
    await expect(report).toHaveText('Missing host tokens: none');
  }
  await page.getByLabel('Neutral', { exact: true }).check();
  await page.getByLabel('Dark', { exact: true }).check();
  await expect(report).toHaveText('Missing host tokens: none');
  await expect(page.getByTestId('unthemed-token-report')).toContainText('--civic-surface');
  await expect(page.getByTestId('unthemed-token-report')).toContainText('--civic-action');
});
