import { test, expect } from '@playwright/test';
import path = require('path');

/* test des composants web de la trousse */
test('button ref', {
    tag: ['@baseline', '@button']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/button.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('button.png', { fullPage: true });
});
