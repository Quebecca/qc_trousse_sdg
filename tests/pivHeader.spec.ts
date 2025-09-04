import { test, expect } from '@playwright/test';
import path = require('path');


test('pivHeader ref', {
    tag: ['@baseline', '@piv-header']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/pivHeader.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('pivHeader.png', { fullPage: true });
});


//TODO: test du composant svelte

// test('pivHeader svelte', {
//     tag: ['@svelte', '@piv-header']
// }, async ({ page }) => {
//     const htmlFilePath = path.resolve(__dirname, '../public/pivHeaderEmbedded.test.html');
//     await page.goto(`file://${htmlFilePath}`);
//     await expect(page).toHaveScreenshot('pivHeader.png', { fullPage: true });
// });