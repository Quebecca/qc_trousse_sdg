import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/lozengeBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('Lozenge baseline', {
    tag: ['@lozenge', '@baseline']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('lozenge.png', { fullPage: true });
});
