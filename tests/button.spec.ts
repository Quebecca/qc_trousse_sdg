import { test, expect } from '@playwright/test';
import path = require('path');

/* test des composants web de la trousse */
test('button ref', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/button.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('button.png', { fullPage: true });
});

/* test des composants svelte */
test('button svelte', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/buttonEmbedded.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('button.png', { fullPage: true });
});

test('button-primary, hover style is applied on hover', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/button.test.html');
    await page.goto(`file://${htmlFilePath}`);
    const button = page.locator('.qc-button.qc-primary').first();

    await button.hover();
    await page.waitForTimeout(300);
    const bgColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
    const borderColor = await button.evaluate(el => getComputedStyle(el).borderColor);
    expect(bgColor).toBe('rgb(20, 114, 191)')
    expect(borderColor).toBe('rgb(20, 114, 191)')

});

test('button-primary, focus style is applied on focus', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/button.test.html');
    await page.goto(`file://${htmlFilePath}`);
    const button = page.locator('.qc-button.qc-primary').first();

    await button.focus();
    await page.waitForTimeout(300);
    const boxShadow = await button.evaluate(el => getComputedStyle(el).boxShadow);

    expect(boxShadow).not.toBe('none');
});

test('button-primary, active style is applied on mousedown', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/button.test.html');
    await page.goto(`file://${htmlFilePath}`);
    const button = page.locator('.qc-button.qc-primary').first();

    const before = await button.evaluate(el => getComputedStyle(el).backgroundColor);
    await button.dispatchEvent('mousedown');
    const during = await button.evaluate(el => getComputedStyle(el).backgroundColor);
    await button.dispatchEvent('mouseup');

    expect(during).not.toEqual(before);
});
