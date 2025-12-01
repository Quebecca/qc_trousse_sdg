import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/alertBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('Alert baseline', {
    tag: ['@alert', '@baseline']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('alert.png', { fullPage: true });
});

test('Fermeture d\'alerte', {
    tag: ['@alert', '@baseline']
}, async ({ page }) => {
    await page.getByRole('button', { name: 'Fermer l’alerte' }).click();
    await expect(page).toHaveScreenshot('alert-hide.png', { fullPage: true });

    await page.reload();
    await expect(page).toHaveScreenshot('alert-hide.png', { fullPage: true });
});