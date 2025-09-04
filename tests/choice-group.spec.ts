import { test, expect } from '@playwright/test';
import path = require('path');

test('choice-group radios ref', {
    tag: ['@baseline', '@radios']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/radios.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('radios.png', {fullPage: true});
});
test('choice-group radios svelte', {
    tag: ['@svelte', '@radios']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/radiosEmbedded.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('radios.png', {fullPage: true});
});

test('choice-group checkbox ref', {
    tag: ['@baseline', '@checkbox']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/checkbox.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('checkbox.png',{fullPage: true});
});
test('choice-group checkbox svelte', {
    tag: ['@svelte', '@checkbox']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/checkboxEmbedded.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('checkbox.png',{fullPage: true});
});