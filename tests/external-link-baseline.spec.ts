import {expect, test} from "@playwright/test";
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/externalLinkBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Rendu visuel', () => {
    test(
    'Survol de lien', {
            tag: ['@baseline', '@external-link']
        }, async ({ page }) => {
        await page.getByRole('link', { name: 'Lorem ipsum dolor sit amet,' }).first().hover();

        await expect(page).toHaveScreenshot('externalLinkHover.png', {fullPage: true});
    });
});