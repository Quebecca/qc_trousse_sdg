import { test, expect } from '@playwright/test';
import path = require('path');


test('icon ref', {
    tag: ['@svelte', '@icon']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/iconSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('icon.png', { fullPage: true });
});
