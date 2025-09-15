import { test, expect } from '@playwright/test';
import path = require('path');

test('search bar baseline', {
    tag: ['@baseline', '@search-bar']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/searchBarBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('search-bar.png', { fullPage: true });
});
