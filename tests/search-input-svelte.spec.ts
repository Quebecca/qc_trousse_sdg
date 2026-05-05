import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/searchInputSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('SearchInput svelte — état initial', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('searchInput-empty.png', { fullPage: true });
});

test('SearchInput svelte — avec valeur et bouton clear', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await page.locator('input[placeholder="Sans debounce"]').fill('Climat');
    await expect(page).toHaveScreenshot('searchInput-filled.png', { fullPage: true });
});

test('SearchInput svelte — focus', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await page.locator('input[placeholder="Sans debounce"]').focus();
    await expect(page).toHaveScreenshot('searchInput-focus.png', { fullPage: true });
});

test('SearchInput svelte — sans debounce, propagation immédiate', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Sans debounce"]');
    await input.fill('test');
    await expect(input).toHaveValue('test');
});

test('SearchInput svelte — avec debounce, propagation après délai', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Avec debounce"]');
    await input.pressSequentially('abc', { delay: 50 });
    await expect(input).toHaveValue('abc');

    await page.waitForTimeout(400);
    await expect(input).toHaveValue('abc');
});

test('SearchInput svelte — clear réinitialise le champ', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Sans debounce"]');
    await input.fill('texte à effacer');
    await expect(input).toHaveValue('texte à effacer');

    await page.getByRole('button', { name: 'Effacer le texte' }).first().click();
    await expect(input).toHaveValue('');
});
