import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/textFieldBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
})

/* test des composants web de la trousse */
test('textfield baseline', {
    tag: ['@baseline', '@textfield']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('textField.png', {fullPage: true});
});

test.describe('Aria', () => {
    test('aria-required', async ({ page }) => {
        await expect(page.locator('#text-lg')).toHaveAttribute('aria-required', 'true');
    });

    test('aria-invalid', async ({ page }) => {
        await expect(page.locator('#text-md')).toHaveAttribute('aria-invalid', 'true');

        await page.locator('#text-md').click();
        await page.locator('#text-md').fill('1');
        await expect(page.locator('#text-md')).toHaveAttribute('aria-invalid', 'false');
    });
});

test('Erreur sur blur', async ({ page }) => {
    await page.locator('#suggestions-blur-test').focus();
    await page.locator('#suggestions-blur-test').press('Tab');

    await expect(page.locator('#suggestions-blur-test')).toHaveAttribute('aria-invalid', 'true');
});
