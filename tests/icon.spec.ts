import { test, expect } from '@playwright/test';
import path = require('path');


test('icon ref', {
    tag: ['@baseline', '@icon']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/icon.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('icon.png', { fullPage: true });
});

test('icon svelte', {
    tag: ['@svelte', '@icon']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/iconEmbedded.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('icon.png', { fullPage: true });
});