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
/*
 * @mobile : aucune règle mobile pour ce composant, donc pas de baseline mobile.
 * Preuve (aucune règle de largeur, média-requête, vw, @container ni logique tactile) :
 *   $ grep -rnE 'clientWidth|innerWidth|matchMedia|grid\.json|touch(start|end|move)|touch-action|pointer-events|pointerType|@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row' src/sdg/components/ExternalLink --exclude-dir=Test --exclude=*.html --exclude=*.ejs
 *   -> 0 résultat
 */
test.skip('external-link-baseline mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
