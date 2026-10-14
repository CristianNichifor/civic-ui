import { expect, test, type Page } from '@playwright/test';

// Resolve a CSS system colour in the current rendering mode.
const system = (page: Page, color: string) => page.evaluate(value => {
  const probe = document.createElement('span');
  probe.style.color = value;
  probe.style.forcedColorAdjust = 'none';
  document.querySelector('.showcase')!.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}, color);

test.describe('forced colors', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/showcase.html');
    test.skip(!(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)),
      'This engine cannot emulate forced colors');
  });

  test('switch and segmented control show state with system colours', async ({ page }) => {
    const highlight = await system(page, 'Highlight');
    const highlightText = await system(page, 'HighlightText');
    const canvasText = await system(page, 'CanvasText');
    const toggle = page.getByRole('switch', { name: 'Notify reviewers' });
    await expect(toggle).toBeChecked();
    await expect(toggle).toHaveCSS('background-color', highlight);
    await expect(toggle.locator('.civic-switch__thumb')).toHaveCSS('background-color', highlightText);
    await toggle.press('Space');
    await expect(toggle).not.toBeChecked();
    await expect(toggle).toHaveCSS('border-top-color', canvasText);
    await expect(toggle.locator('.civic-switch__thumb')).toHaveCSS('background-color', canvasText);
    const density = page.getByRole('group', { name: 'View density' });
    const checked = density.locator('.civic-segmented__option').filter({ hasText: 'Comfortable' });
    await expect(checked).toHaveCSS('background-color', highlight);
    await expect(checked).toHaveCSS('color', highlightText);
    await expect(page.getByRole('tab', { name: 'Documents', exact: true })).toHaveCSS('background-color', highlight);
  });

  test('range, progress and focus rings keep visible system outlines', async ({ page, browserName }) => {
    const canvasText = await system(page, 'CanvasText');
    const slider = page.getByRole('slider', { name: 'Preview zoom' });
    await expect(slider).toHaveCSS('outline-style', 'solid');
    await expect(slider).toHaveCSS('outline-color', canvasText);
    await page.getByRole('link', { name: 'Shared primitives', exact: true }).click();
    const progress = page.getByRole('progressbar', { name: 'Indexing documents' });
    await expect(progress).toHaveCSS('outline-style', 'solid');
    await expect(progress).toHaveCSS('outline-color', canvasText);
    for (const control of [
      page.getByRole('switch', { name: 'Notify reviewers' }),
      page.getByRole('combobox', { name: 'Review format' }),
      page.getByRole('button', { name: 'Edit document', exact: true }),
    ]) {
      await control.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(control).toBeFocused();
      await expect(control).toHaveCSS('outline-style', 'solid');
    }
    // WebKit does not match :focus-visible on a programmatically focused radio.
    if (browserName === 'webkit') return;
    await page.getByRole('radio', { name: 'Comfortable' }).focus();
    await page.keyboard.press('ArrowRight');
    const option = page.locator('.civic-segmented__option').filter({ hasText: 'Compact' });
    await expect(option).toHaveCSS('outline-style', 'solid');
  });

  test('highlighted menu items use system colours', async ({ page }) => {
    // Scoped styles reach overlays only through a portal inside .civic-scope.
    await page.goto('/showcase.html?portal=1');
    const highlight = await system(page, 'Highlight');
    const highlightText = await system(page, 'HighlightText');
    await page.getByRole('button', { name: 'Document actions' }).focus();
    await page.keyboard.press('ArrowDown');
    const item = page.getByRole('menuitem', { name: 'Edit metadata' });
    await expect(item).toBeFocused();
    await expect(item).toHaveCSS('background-color', highlight);
    await expect(item).toHaveCSS('color', highlightText);
  });
});

test('reduced motion stops every spinner and the switch transition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/showcase.html');
  await expect(page.locator('.civic-loading svg')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.civic-operation-status__spinner')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.civic-switch__thumb')).toHaveCSS('transition-duration', '0s');
});
