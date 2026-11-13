import {expect, test} from "@playwright/test";
import path = require('path');

// La typographie est purement CSS (pas de composant). Un unique snapshot visuel de la fixture
// (paragraphes, tailles utilitaires .qc-font-size-*, familles header/content/code, graisses
// header et content en romain/italique, exposant/indice et code inline) valide l'ensemble
// du rendu de _paragraph.scss et _fonts.scss.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/typographyBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Typographie', () => {
    test('rendu visuel de référence de la typographie', {
        tag: ['@baseline', '@typography']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('typography.png', {fullPage: true});
    });
});

/*
 * @mobile : la seule règle de largeur (_paragraph.scss, max-width: 320px) ne s’applique pas à 390/393 px; la fixture n’a aucun titre h1-h3
 * Preuve :
 *   $ grep -rnE '@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row|clientWidth|innerWidth|matchMedia' src/sdg/bases/typography --include='*.scss'
 *   -> _paragraph.scss:14: @media (max-width: 320px)  (Pixel 5 = 393 px, iPhone 12 = 390 px : jamais déclenchée)
 *   $ grep -cE '<h[1-3]' src/sdg/bases/typography/typographyBaselineTest.html -> 0 (les tokens de titres md/sm ne s'appliquent pas)
 */
test.skip('typography-baseline mobile : la seule règle de largeur (_paragraph.scss, max-width: 320px) ne s’applique pas à 390/393 px; la fixture n’a aucun titre h1-h3', {
    tag: ['@mobile']
}, async () => {});
