import { test, expect } from '@playwright/test';
import path from 'path';

const htmlFilePath = path.resolve(__dirname, '..', 'public', 'iconFontBaseline.test.html');

test('Icon font baseline', {
  tag: ['@baseline', '@icon-font']
}, async ({ page }) => {
  await page.goto(`file://${htmlFilePath}`);
  await page.waitForFunction(() => document.fonts.ready);
  await expect(page).toHaveScreenshot('iconFont.png', { fullPage: true });
});
