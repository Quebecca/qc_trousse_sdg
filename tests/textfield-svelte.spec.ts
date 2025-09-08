import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/textFieldSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
})

/* test des composants web de la trousse */
test('textfield ref', {
    tag: ['@svelte', '@textfield']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('textField.png', {fullPage: true});
});

test.describe('Aria', () => {
    test('aria-required', {
        tag: ['@aria', '@svelte', '@textfield']
    }, async ({ page }) => {
        await expect(page.getByRole('textbox', { name: 'Large', exact: true })).toHaveAttribute('aria-required', 'true');
    });

    test('aria-invalid', {
        tag: ['@aria', '@svelte', '@textfield']
    }, async ({ page }) => {
        await expect(page.getByRole('textbox', { name: 'Moyen', exact: true })).toHaveAttribute('aria-invalid', 'true');

        await page.getByRole('textbox', { name: 'Moyen' }).click();
        await page.getByRole('textbox', { name: 'Moyen' }).fill('1');
        await expect(page.getByRole('textbox', { name: 'Moyen', exact: true })).toHaveAttribute('aria-invalid', 'false');
    });
});
