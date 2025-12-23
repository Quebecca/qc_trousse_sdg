import { test, expect } from '@playwright/test';
import path = require('path');

test('choice-group radios baseline', {
    tag: ['@baseline', '@radios']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/radiosBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await expect(page).toHaveScreenshot('radios.png', {fullPage: true});
});

test('choice-group checkbox baseline', {
    tag: ['@baseline', '@checkbox']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/checkboxBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await expect(page).toHaveScreenshot('checkbox.png',{fullPage: true});
});

test('Erreur sur blur radios', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/radiosBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await page.locator('#on-blur-validation-group-1').focus();
    await page.locator('#on-blur-validation-group-1').blur();

    await expect(page.locator('#on-blur-validation-group-1')).toHaveAttribute('aria-invalid', 'true');
});

test('Erreur sur blur checkbox', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/checkboxBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await page.locator('#on-blur-validation-group-1').focus();
    await page.locator('#on-blur-validation-group-1').blur();

    await expect(page.locator('#on-blur-validation-group-1')).toHaveAttribute('aria-invalid', 'true');
});