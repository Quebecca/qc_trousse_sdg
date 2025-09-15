import { test, expect } from '@playwright/test';
import path = require('path');

test('search bar svelte', {
    tag: ['@svelte', '@search-bar']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/searchBarSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('search-bar.png', { fullPage: true });
});
