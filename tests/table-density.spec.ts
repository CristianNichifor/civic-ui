import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/showcase.html');
});

test('compact density is an explicit data attribute with tighter cells', async ({ page }) => {
  const table = page.getByRole('table');
  await expect(table).toHaveAttribute('data-density', 'comfortable');
  const cell = table.locator('tbody td').first();
  const comfortable = await cell.evaluate(el => parseFloat(getComputedStyle(el).paddingTop));
  await page.getByRole('group', { name: 'View density' }).getByText('Compact', { exact: true }).click();
  await expect(table).toHaveAttribute('data-density', 'compact');
  const compact = await cell.evaluate(el => parseFloat(getComputedStyle(el).paddingTop));
  expect(compact).toBeLessThan(comfortable);
});

test('card layout replaces horizontal scrolling at 390 px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const table = page.locator('.civic-table');
  await expect(table).toHaveAttribute('data-mobile-layout', 'cards');
  const row = table.locator('tbody tr').first();
  await expect(row).toHaveCSS('display', 'block');
  const label = await row.locator('td').first().evaluate(el => getComputedStyle(el, '::before').content);
  expect(label).toBe('"Document"');
  await expect(page.getByRole('button', { name: 'Document', exact: true })).toBeVisible();
  const region = page.getByRole('region', { name: 'Archive documents' });
  expect(await region.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(row).toHaveCSS('display', 'table-row');
  expect(await row.locator('td').first().evaluate(el => getComputedStyle(el, '::before').content)).toBe('none');
});
