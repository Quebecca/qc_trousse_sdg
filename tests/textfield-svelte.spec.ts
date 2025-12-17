import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/textFieldSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
})

/* test des composants web de la trousse */
test('textfield svelte', {
    tag: ['@svelte', '@textfield']
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
