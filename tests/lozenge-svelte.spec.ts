import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/lozengeSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('Lozenge svelte', {
    tag: ['@lozenge', '@svelte']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('lozenge.png', { fullPage: true });
});
