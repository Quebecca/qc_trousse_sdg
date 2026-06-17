import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/iconBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('Icon — icônes Material Symbols toutes tailles', {
    tag: ['@baseline', '@icon']
}, async ({ page }) => {
    const section = page.locator('.section-material-sizes');
    await expect(section).toHaveScreenshot('icon-material-sizes.png');
});

test('Icon — variantes outlined vs filled', {
    tag: ['@baseline', '@icon']
}, async ({ page }) => {
    const section = page.locator('.section-variants');
    await expect(section).toHaveScreenshot('icon-variants.png');
});

test('Icon — couleurs personnalisées', {
    tag: ['@baseline', '@icon']
}, async ({ page }) => {
    const section = page.locator('.section-colors');
    await expect(section).toHaveScreenshot('icon-colors.png');
});

test('Icon — rotation', {
    tag: ['@baseline', '@icon']
}, async ({ page }) => {
    const section = page.locator('.section-rotation');
    await expect(section).toHaveScreenshot('icon-rotation.png');
});

test('Icon — icône personnalisée via src', {
    tag: ['@baseline', '@icon']
}, async ({ page }) => {
    const section = page.locator('.section-custom-src');
    await expect(section).toHaveScreenshot('icon-custom-src.png');
});

test('Icon — alias legacy', {
    tag: ['@baseline', '@icon']
}, async ({ page }) => {
    const section = page.locator('.section-legacy');
    await expect(section).toHaveScreenshot('icon-legacy-aliases.png');
});
