import { test, expect } from '@playwright/test';
import path = require('path');


test('pivHeader baseline', {
    tag: ['@baseline', '@piv-header']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/pivHeaderBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('pivHeader.png', { fullPage: true });
});
