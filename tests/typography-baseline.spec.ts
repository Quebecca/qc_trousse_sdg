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
