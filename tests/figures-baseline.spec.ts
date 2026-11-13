import {expect, test} from "@playwright/test";
import path = require('path');

// Les figures/images sont purement CSS (pas de composant). Un unique snapshot visuel de la
// fixture (figure + légende, figure sans légende, légende longue, image nue en ligne) valide
// l'ensemble du rendu de _figure.scss.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/figuresBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Figures', () => {
    test('rendu visuel de référence des figures et images', {
        tag: ['@baseline', '@figures']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
            // Attendre le décodage de toutes les images pour un snapshot stable.
            await Promise.all(
                Array.from(document.images).map((img) =>
                    img.complete ? Promise.resolve() : img.decode().catch(() => {})
                )
            );
        });
        await expect(page).toHaveScreenshot('figures.png', {fullPage: true});
    });
});

/*
 * @mobile : aucune règle mobile
 * Preuve :
 *   $ grep -rnE '@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row|clientWidth|innerWidth|matchMedia' src/sdg/bases/figures --include='*.scss'
 *   -> 0 résultat
 */
test.skip('figures-baseline mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
