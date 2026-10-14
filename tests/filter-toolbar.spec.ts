import { expect, test } from '@playwright/test';

test('filter toolbar wraps at 390 px without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/showcase.html');
  const toolbar = page.getByRole('group', { name: 'Archive filters' });
  const bounds = (await toolbar.boundingBox())!;
  const search = (await toolbar.getByRole('searchbox', { name: 'Search archive' }).boundingBox())!;
  const visibility = (await toolbar.getByRole('combobox', { name: 'Visibility filter' }).boundingBox())!;
  for (const box of [search, visibility]) {
    expect(box.x).toBeGreaterThanOrEqual(bounds.x);
    expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width);
  }
  expect(visibility.y).toBeGreaterThan(search.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('result count is announced politely and reset restores it', async ({ page }) => {
  await page.goto('/showcase.html');
  const toolbar = page.getByRole('group', { name: 'Archive filters' });
  const count = toolbar.locator('.civic-filter-toolbar__count');
  await expect(count).toHaveAttribute('aria-live', 'polite');
  await expect(count).toHaveAttribute('aria-atomic', 'true');
  await expect(count).toHaveText('4 documents');
  await toolbar.getByRole('searchbox', { name: 'Search archive' }).fill('bud');
  await expect(count).toHaveText('1 document');
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1);
  await toolbar.getByRole('combobox', { name: 'Visibility filter' }).selectOption('draft');
  await expect(count).toHaveText('0 documents');
  await toolbar.getByRole('button', { name: 'Reset filters' }).click();
  await expect(count).toHaveText('4 documents');
  await expect(toolbar.getByRole('searchbox', { name: 'Search archive' })).toHaveValue('');
});
