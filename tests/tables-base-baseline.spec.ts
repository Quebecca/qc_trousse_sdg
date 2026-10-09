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
