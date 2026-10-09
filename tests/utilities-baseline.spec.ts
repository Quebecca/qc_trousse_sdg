import {expect, test} from "@playwright/test";
import path = require('path');

// Les utilitaires sont purement CSS (pas de composant). Un unique snapshot visuel
// de la fixture valide les classes réellement livrées dans dist/css/qc-sdg.min.css :
// display (.qc-d-* base : block/inline/inline-block/flex/inline-flex/table/none),
// .qc-nowrap, états (.qc-required, .qc-disabled) et thèmes (.qc-*-theme-show, rendu
// en thème clair). Les utilitaires vendor _spacing.scss/_flex.scss ne sont PLUS
// compilés (aucun @use) — leurs classes sont absentes du livrable, donc non testées.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/utilitiesBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Utilitaires', () => {
    test('rendu visuel de référence des utilitaires', {
        tag: ['@baseline', '@utilities']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('utilities.png', {fullPage: true});
    });
});
