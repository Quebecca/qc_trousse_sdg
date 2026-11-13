import {expect, test} from "@playwright/test";
import path = require('path');

// Les titres sont purement CSS (pas de composant). Un unique snapshot visuel de la fixture
// (balises natives hN, classes .qc-hN et .qc-heading-<taille>, découplage, surtitre dans un
// hgroup et dans un h1) valide l'ensemble du rendu.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/headings.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Titres', () => {
    test('rendu visuel de référence des titres', {
        tag: ['@baseline', '@headings']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('headings.png', {fullPage: true});
    });
});

/*
 * @mobile : les titres ont une règle de largeur. Les tokens de titres h1-h3 (taille, interligne,
 * marges h2) sont redéfinis sous le breakpoint md (< 992 px) et sm.
 * Preuve :
 *   $ grep -n 'media-breakpoint-down' src/sdg/scss/qc-design-tokens.scss
 *   -> generate-token-for-breakpoints : tokens $breakpoints-tokens (md: h1 36, h2 28, h3 25)
 *   Pixel 5 (393 px) et iPhone 12 (390 px) sont sous 992 px : tailles différentes du desktop (1280 px).
 */
test.describe('Titres (mobile)', () => {
    test.beforeEach(async ({page}) => {
        const htmlFilePath = path.resolve(__dirname, '../public/headings.test.html');
        await page.goto(`file://${htmlFilePath}`);
    });

    test('rendu visuel de référence des titres en mobile', {
        tag: ['@baseline', '@headings', '@mobile']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        // Les tokens md s'appliquent : h1 = 36 px, h2 = 28 px, h3 = 25 px (rem(), racine 62,5 %).
        const sizes = await page.evaluate(() => ['h1', 'h2', 'h3'].map(
            (t) => getComputedStyle(document.querySelector(t)!).fontSize));
        expect(sizes).toEqual(['36px', '28px', '25px']);
        await expect(page).toHaveScreenshot('headings.png', {fullPage: true});
    });
});
