import { test, expect } from '@playwright/test';
import path from 'path';

const htmlFilePath = path.resolve(__dirname, '..', 'public', 'iconFontSvelte.test.html');

test('Icon font svelte', {
  tag: ['@svelte', '@icon-font']
}, async ({ page }) => {
  await page.goto(`file://${htmlFilePath}`);
  await page.waitForFunction(() => document.fonts.ready);
  await expect(page).toHaveScreenshot('iconFont.png', { fullPage: true });
});
