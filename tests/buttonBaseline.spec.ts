import { test, expect } from '@playwright/test';
import path = require('path');

/* test des composants web de la trousse */
// buildSvelteTests-ignore
test('button baseline', {
    tag: ['@baseline', '@button']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/buttonBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('button.png', { fullPage: true });
});
