import {expect, test} from "@playwright/test";
import path = require('path');

// Les ombrages sont purement CSS (pas de composant). Un unique snapshot visuel de la
// fixture — qui couvre les 5 niveaux d'élévation (0 = bordure, 1 à 4 = box-shadow de
// flou/décalage croissant, tokens box_shadow) — valide l'ensemble du rendu.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/shadingsBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Ombrages', () => {
    test('rendu visuel de référence des ombrages', {
        tag: ['@baseline', '@shadings']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('shadings.png', {fullPage: true});
    });
});

/*
 * @mobile : aucune règle mobile
 * Preuve :
 *   $ grep -rnE '@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row|clientWidth|innerWidth|matchMedia' src/sdg/bases/shadings --include='*.scss'
 *   -> 0 résultat
 */
test.skip('shadings-baseline mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
