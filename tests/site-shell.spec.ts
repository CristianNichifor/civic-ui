import { expect, test } from '@playwright/test';

test('site shell exposes banner, main and contentinfo landmarks', async ({ page }) => {
  await page.goto('/site.html');
  const banner = page.getByRole('banner');
  await expect(banner.getByRole('link', { name: 'CN Lab' })).toHaveAttribute('href', '/');
  await expect(banner).toContainText('Local budget');
  await expect(banner).toContainText('Beta');
  const languages = banner.getByRole('navigation', { name: 'Language' });
  await expect(languages.getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'true');
  await expect(languages.getByRole('link', { name: 'RO' })).not.toHaveAttribute('aria-current');
  await expect(languages.getByRole('link', { name: 'RO' })).toHaveAttribute('hreflang', 'ro');
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toHaveText('Local budget');
  const footer = page.getByRole('contentinfo').getByRole('navigation', { name: 'Site information' });
  await expect(footer.getByRole('link')).toHaveText(['Method', 'Privacy', 'Source code', 'Contact']);
});

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/site.html');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('site shell switches to Romanian and fits 320 px', async ({ page }) => {
  await page.goto('/site.html?lang=ro');
  const languages = page.getByRole('banner').getByRole('navigation', { name: 'Limbă' });
  await expect(languages.getByRole('link', { name: 'RO' })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('contentinfo').getByRole('navigation', { name: 'Informații despre site' })).toBeVisible();
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
