import { expect, test } from '@playwright/test';

test('stat tiles format numbers and state deltas in text', async ({ page }) => {
  await page.goto('/site.html');
  const grid = page.getByRole('list', { name: 'Key figures' });
  await expect(grid.getByRole('listitem')).toHaveCount(3);
  const spending = grid.getByRole('listitem').nth(0);
  await expect(spending.locator('.civic-stat-tile__value')).toHaveText(/^1,234,568\sRON$/);
  await expect(spending.locator('data')).toHaveAttribute('value', '1234567.8');
  await expect(spending.locator('.civic-stat-tile__delta')).toHaveAttribute('data-trend', 'up');
  await expect(spending.locator('.civic-stat-tile__delta')).toHaveAttribute('data-sentiment', 'bad');
  await expect(spending.locator('.civic-stat-tile__delta')).toContainText('Increase');
  await expect(spending.locator('.civic-stat-tile__delta')).toContainText('+4.2%');
  await expect(spending.locator('time')).toHaveAttribute('datetime', '2026-10-01');
  await expect(spending).toContainText('As of');
  const projects = grid.getByRole('listitem').nth(1).locator('.civic-stat-tile__delta');
  await expect(projects).toHaveAttribute('data-trend', 'down');
  await expect(projects).toHaveAttribute('data-sentiment', 'bad');
  await expect(projects).toContainText('Decrease');
  await expect(projects).toContainText('−3');
  const schools = grid.getByRole('listitem').nth(2).locator('.civic-stat-tile__delta');
  await expect(schools).toHaveAttribute('data-trend', 'flat');
  await expect(schools).toContainText('No change');
});

test('stat tiles use the host locale and wrap to one column at 390 px', async ({ page }) => {
  await page.goto('/site.html?lang=ro');
  const tiles = page.getByRole('list', { name: 'Key figures' }).getByRole('listitem');
  await expect(tiles.nth(0).locator('.civic-stat-tile__value')).toHaveText(/^1\.234\.568\sRON$/);
  await expect(tiles.nth(0)).toContainText('Creștere');
  await page.setViewportSize({ width: 390, height: 900 });
  const boxes = await tiles.evaluateAll(items => items.map(item => item.getBoundingClientRect().x));
  expect(new Set(boxes).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
