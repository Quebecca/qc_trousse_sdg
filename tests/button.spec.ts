import { test, expect } from '@playwright/test';
import path = require('path');

test('Button', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/button.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot({ fullPage: true });
});

test('Tous les boutons doivent être visibles', async ({ page }) => {
    const buttons = await page.locator('qc-button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
        await expect(buttons.nth(i)).toBeVisible();
    }
});
