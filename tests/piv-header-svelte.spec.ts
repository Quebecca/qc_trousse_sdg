import { test, expect } from '@playwright/test';
import path = require('path');


test('pivHeader svelte', {
    tag: ['@svelte', '@piv-header']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/pivHeaderSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('pivHeader.png', { fullPage: true });
});
