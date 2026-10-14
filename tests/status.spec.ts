import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/showcase.html');
});

test('status messages use status for success and warning, alert for errors', async ({ page }) => {
  const success = page.locator('.civic-status-message[data-tone="success"]');
  await expect(success).toHaveAttribute('role', 'status');
  await expect(success).toContainText('Archive saved');
  await expect(success.getByRole('button')).toHaveCount(0);
  const warning = page.locator('.civic-status-message[data-tone="warning"]');
  await expect(warning).toHaveAttribute('role', 'status');
  await expect(warning.getByRole('button')).toHaveCount(0);
  const error = page.getByRole('alert').filter({ hasText: 'Archive could not be refreshed' });
  await expect(error).toHaveClass(/civic-status-message/);
  await expect(error).toHaveAttribute('data-tone', 'error');
});

test('retry is a native button that works from the keyboard', async ({ page }) => {
  const error = page.getByRole('alert').filter({ hasText: 'Archive could not be refreshed' });
  const retry = error.getByRole('button', { name: 'Retry', exact: true });
  await expect(retry).toHaveAttribute('type', 'button');
  await retry.focus();
  await page.keyboard.press('Enter');
  await expect(error).toContainText('Retries: 1');
  await page.keyboard.press('Space');
  await expect(error).toContainText('Retries: 2');
  await expect(retry).toBeFocused();
  await expect(retry).toHaveCSS('outline-style', 'solid');
});

test('status messages fit a 320 px viewport in every theme', async ({ page }) => {
  for (const theme of ['Light', 'Dark', 'USR host tokens']) {
    await page.getByLabel(theme, { exact: true }).check();
    await page.setViewportSize({ width: 320, height: 900 });
    for (const message of await page.locator('.civic-status-message').all()) {
      const box = (await message.boundingBox())!;
      expect(box.x + box.width).toBeLessThanOrEqual(320);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  }
});
