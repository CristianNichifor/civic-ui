import { expect, test } from '@playwright/test';

test('chart frame names the chart and toggles a table view', async ({ page }) => {
  await page.goto('/site.html');
  const figure = page.getByRole('figure', { name: 'Spending by year' });
  await expect(figure).toContainText('Did spending rise after 2024?');
  await expect(figure.getByText('Demo data', { exact: true })).toBeVisible();
  await expect(figure.getByRole('img', { name: 'Bar chart of spending by year' })).toBeVisible();
  const toggle = figure.getByRole('button', { name: 'Show as table' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(figure.getByRole('table', { name: 'Spending by year' })).toBeVisible();
  await expect(figure.getByRole('img', { name: 'Bar chart of spending by year' })).toHaveCount(0);
  await page.keyboard.press('Space');
  await expect(figure.getByRole('img', { name: 'Bar chart of spending by year' })).toBeVisible();
});

test('source citation records source, licence, date and method', async ({ page }) => {
  await page.goto('/site.html');
  const citation = page.getByRole('figure').locator('.civic-source');
  await expect(citation.getByRole('link', { name: 'Synthetic dataset' })).toHaveAttribute('href', '#data');
  await expect(citation.getByRole('link', { name: 'CC BY 4.0' })).toHaveAttribute('rel', /license/);
  await expect(citation.locator('time')).toHaveAttribute('datetime', '2026-10-01');
  await expect(citation.getByRole('link', { name: 'Method' })).toHaveAttribute('href', '#method');
  await expect(citation).toContainText('Source');
  await expect(citation).toContainText('Licence');
});

test('empty and error states replace the chart and hide the toggle', async ({ page }) => {
  await page.goto('/site.html');
  const figure = page.getByRole('figure', { name: 'Spending by year' });
  await page.getByRole('button', { name: 'Empty', exact: true }).click();
  await expect(figure).toContainText('No spending recorded for this filter.');
  await expect(figure.getByRole('button', { name: 'Show as table' })).toHaveCount(0);
  await expect(figure.getByRole('img')).toHaveCount(0);
  await page.getByRole('button', { name: 'Error', exact: true }).click();
  const alert = figure.getByRole('alert');
  await expect(alert).toContainText('Data could not be loaded');
  await alert.getByRole('button', { name: 'Retry' }).click();
  await expect(figure.getByRole('img', { name: 'Bar chart of spending by year' })).toBeVisible();
});

test('chart frame translates its chrome and fits 320 px', async ({ page }) => {
  await page.goto('/site.html?lang=ro');
  const figure = page.getByRole('figure', { name: 'Spending by year' });
  await expect(figure.getByRole('button', { name: 'Afișează ca tabel' })).toBeVisible();
  await expect(figure.getByText('Date demonstrative', { exact: true })).toBeVisible();
  await expect(figure.locator('.civic-source')).toContainText('Sursa');
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
