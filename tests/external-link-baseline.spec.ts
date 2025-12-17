import {expect, test} from "@playwright/test";
import path = require('path');
import {link} from "node:fs";

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

    test(
        'Clique sur lien', {
            tag: ['@baseline', '@external-link']
        }, async ({ page }) => {
        await page.locator('#multi-links').evaluate((link: HTMLElement) => {
            link.querySelector('a').innerHTML = 'Cliquez ici';
        });

        await expect(page).toHaveScreenshot('externalLinkChange.png', {fullPage: true});
    })
});