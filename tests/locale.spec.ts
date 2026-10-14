import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const english = {
  pagination: 'Pagination', previous: 'Previous page', next: 'Next page', placeholder: 'Select an option',
  close: 'Close dialog', confirm: 'Confirm', cancel: 'Cancel', loading: 'Loading', filters: 'Filters',
  summary: 'Please check the following fields',
};
const romanian = {
  pagination: 'Paginare', previous: 'Pagina anterioară', next: 'Pagina următoare', placeholder: 'Selectați o opțiune',
  close: 'Închideți dialogul', confirm: 'Confirmați', cancel: 'Anulați', loading: 'Se încarcă', filters: 'Filtre',
  summary: 'Verificați următoarele câmpuri',
};

async function expectLabels(page: Page, labels: typeof english) {
  await expect(page.getByRole('navigation', { name: labels.pagination, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: labels.previous, exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: labels.next, exact: true })).toBeEnabled();
  await expect(page.getByRole('combobox', { name: 'Format' })).toHaveText(labels.placeholder);
  await expect(page.getByRole('status').filter({ hasText: labels.loading })).toHaveText(labels.loading);
  await expect(page.getByRole('group', { name: labels.filters, exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText(labels.summary);
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: labels.close, exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open alert' }).click();
  const alert = page.getByRole('alertdialog');
  await expect(alert.getByRole('button', { name: labels.cancel, exact: true })).toBeFocused();
  await expect(alert.getByRole('button', { name: labels.confirm, exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
}

test('components keep English defaults without a preset', async ({ page }) => {
  await page.goto('/locale.html');
  await expectLabels(page, english);
});

test('enLabels reproduces the defaults exactly', async ({ page }) => {
  await page.goto('/locale.html?preset=en');
  await expectLabels(page, english);
});

test('roLabels translates every default string', async ({ page }) => {
  await page.goto('/locale.html?preset=ro');
  await expectLabels(page, romanian);
});

test('presets share one key set and Romanian uses comma-below diacritics', async ({ page }) => {
  await page.goto('/locale.html');
  const { en, ro } = JSON.parse(await page.locator('#labels').textContent() ?? '{}');
  const shape = (labels: Record<string, Record<string, string>>) =>
    Object.entries(labels).map(([name, props]) => `${name}:${Object.keys(props).sort()}`).sort();
  expect(shape(ro)).toEqual(shape(en));
  const source = await readFile('src/locales/ro.ts', 'utf8');
  expect(source).not.toMatch(/[şţŞŢ]/);
  expect(JSON.stringify(ro)).not.toMatch(/[şţŞŢ]/);
});
