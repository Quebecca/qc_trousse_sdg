import {expect, test} from "@playwright/test";
import path = require('path');

// Base CSS des tableaux (`table.qc-table` utilisé SANS le composant Web <qc-table>).
// Purement CSS (pas de composant) : un unique snapshot visuel de la fixture valide
// l'ensemble du rendu — standard (en-tête bleu), en-tête gris pâle, simplifié, rayé
// (qc-striped), alignement numérique, en-tête sans <thead>, liste verticale clé/valeur.
// Distinct des tests @table du composant Web qc-table (data-label, clones, cartes mobile).
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/tablesBase.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Base CSS des tableaux', () => {
    test('rendu visuel de référence de la base CSS des tableaux', {
        tag: ['@baseline', '@tables-base']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('tables-base.png', {fullPage: true});
    });
});

// Mobile : skip volontaire. Preuve (aucune règle mobile dans la base CSS des
// tableaux ni dans la fixture) :
//   grep -rnE "@media|@container|media-mobile|media-breakpoint" src/sdg/bases/table/   -> aucun résultat
//   grep -c "qc-table-responsive" src/sdg/bases/table/tablesBaseTest.html            -> 0
// (la classe .qc-table-responsive, seule règle responsive du vendor, n'est pas
// utilisée par la fixture). Les règles mobiles de qc-table sont couvertes par
// table-baseline.spec.ts et table-svelte.spec.ts.
test.skip('rendu mobile de la base CSS des tableaux : aucune règle mobile (pas de média-requête)', {
    tag: ['@baseline', '@tables-base', '@mobile']
}, async () => {});
