import {test, expect} from "@playwright/test";
import path = require('path');

test.beforeEach(async({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/searchInputSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('search input svelte', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('search-input.png', {fullPage: true});
});

test('search input bouton Xclear', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await page.getByRole('button', { name: 'Effacer le texte' }).click();
    await expect(page.getByRole('searchbox', { name: 'Rechercher un sujet' })).toHaveValue('');
});