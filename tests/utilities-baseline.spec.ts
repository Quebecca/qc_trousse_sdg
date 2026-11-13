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

/*
 * @mobile : les utilitaires d'affichage ont une règle de largeur.
 * Preuve :
 *   $ grep -n 'media-breakpoint-up' src/sdg/scss/utilities/_display.scss
 *   -> .qc-d-<sm|md|lg>-<valeur> n'est actif qu'à partir de 768 / 992 / 1200 px (grid.breakpoint).
 *   Pixel 5 (393 px) et iPhone 12 (390 px) sont sous le premier seuil (sm = 768 px) :
 *   seule la classe de base .qc-d-<valeur> s'applique. Test par styles calculés (pas de baseline).
 */
test.describe('Utilitaires (mobile)', () => {
    test('les classes .qc-d-{sm,md,lg} responsives sont inactives sous 768 px', {
        tag: ['@utilities', '@mobile']
    }, async ({page}) => {
        const htmlFilePath = path.resolve(__dirname, '../public/utilitiesBaseline.test.html');
        await page.goto(`file://${htmlFilePath}`);
        const displays = await page.evaluate(() => {
            const cases: [string, string][] = [
                ['qc-d-none qc-d-sm-block', 'none'],
                ['qc-d-none qc-d-md-block', 'none'],
                ['qc-d-none qc-d-lg-flex', 'none'],
                ['qc-d-block qc-d-sm-none', 'block'],
                ['qc-d-block qc-d-md-none', 'block'],
                ['qc-d-inline qc-d-lg-none', 'inline'],
            ];
            return cases.map(([cls]) => {
                const el = document.createElement('div');
                el.className = cls;
                document.body.appendChild(el);
                const d = getComputedStyle(el).display;
                el.remove();
                return d;
            });
        });
        expect(displays).toEqual(['none', 'none', 'none', 'block', 'block', 'inline']);
    });
});
