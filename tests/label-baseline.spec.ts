import {expect, test} from "@playwright/test";
import path = require('path');

// Le Label est une base purement CSS (pas de rendu Svelte piloté ici). Un unique snapshot
// visuel de la fixture valide l'ensemble : .qc-label + .qc-label-text, indicateur requis
// (.qc-required), modificateurs .qc-compact / .qc-bold, et l'état désactivé sous ses deux
// formes (frère :disabled via :has(~ :disabled) et utilitaire .qc-disabled).
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/labelBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Label', () => {
    test('rendu visuel de référence du label', {
        tag: ['@baseline', '@label']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('label.png', {fullPage: true});
    });
});

/*
 * @mobile : aucune règle mobile pour ce composant, donc pas de baseline mobile.
 * Preuve (aucune règle de largeur, média-requête, vw, @container ni logique tactile) :
 *   $ grep -rnE 'clientWidth|innerWidth|matchMedia|grid\.json|touch(start|end|move)|touch-action|pointer-events|pointerType|@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row' src/sdg/components/Label --exclude-dir=Test --exclude=*.html --exclude=*.ejs
 *   -> 0 résultat
 */
test.skip('label-baseline mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
