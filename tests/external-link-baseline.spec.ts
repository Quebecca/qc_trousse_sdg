import {expect, test} from "@playwright/test";
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/externalLinkBaseline.test.html');
    await page.goto(`http://localhost:8080/public/externalLinkBaseline.test.html`);
});

test.describe('Rendu visuel', () => {
    test(
    'Survol de lien', {
            tag: ['@baseline', '@external-link']
        }, async ({ page }) => {
        await page.getByRole('link', { name: 'Lorem ipsum dolor sit amet,' }).first().hover();

        await expect(page).toHaveScreenshot('externalLinkHover.png', {fullPage: true});
    });

    test('Lien visité', {
        tag: ['@baseline', '@external-link']
    }, async ({ page }) => {
        const htmlFilePath = path.resolve(__dirname, '../public/externalLinkBaseline.test.html');

        // Cliquer sur le lien
        await page.getByRole('link', { name: 'https://www.quebec.ca/' }).click();

        // Attendre que l'URL change
        await page.waitForURL(`${htmlFilePath}#multi-links`);

        // Remonter en haut de la page si nécessaire
        await page.evaluate(() => window.scrollTo(0, 0));

        await page.waitForTimeout(100);

        await expect(page).toHaveScreenshot('externalLinkVisit.png', {fullPage: true});

        await page.getByRole('link', { name: 'Lorem ipsum dolor sit amet,' }).first().focus();

        await expect(page).toHaveScreenshot('externalLinkBluredVisited.png', {fullPage: true});
    });
});