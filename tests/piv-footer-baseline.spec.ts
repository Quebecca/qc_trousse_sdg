import {expect, test} from "@playwright/test";
import path = require('path');

// Le pied de page du PIV est piloté par le web component livré (qc-piv-footer) : il n'a
// PAS de harnais svelte distinct (baseline seul, cf. tasks.md tâche 4 + entrée dans
// buildSvelteTestsIgnore.json). Un unique snapshot visuel de la fixture (variante par
// défaut, peu de liens, logo personnalisé + copyright slotté, zones de slots) valide le
// rendu de la carte interne (.qc-piv-footer : logo, copyright) et du contenu slotté
// (nav > ul, stylé par le sélecteur qc-piv-footer).
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/pivFooterBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Pied de page du PIV', () => {
    test('rendu visuel de référence du pied de page du PIV', {
        tag: ['@baseline', '@piv-footer']
    }, async ({page}) => {
        // Le WC hydrate qc-piv-footer et injecte les logos ; attendre les polices et images.
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
            const images = Array.from(document.images);
            await Promise.all(images.map(img => img.complete
                ? Promise.resolve()
                : new Promise(res => { img.onload = img.onerror = res; })));
        });
        await expect(page).toHaveScreenshot('piv-footer.png', {fullPage: true});
    });
});

/*
 * @mobile : aucune règle mobile pour ce composant, donc pas de baseline mobile.
 * Seule occurrence : la classe qc-container-fluid (conteneur 100 % de large, sans
 * max-width par point de rupture ; make-container ne pose qu'un padding fixe).
 * Preuve (aucune règle de largeur, média-requête, vw, @container ni logique tactile) :
 *   $ grep -rnE 'clientWidth|innerWidth|matchMedia|grid\.json|touch(start|end|move)|touch-action|pointer-events|pointerType|@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container-(sm|md|lg|xl)|qc-col-|qc-row' src/sdg/components/PivFooter --exclude-dir=Test --exclude=*.html --exclude=*.ejs
 *   -> 0 résultat
 */
test.skip('piv-footer-baseline mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
