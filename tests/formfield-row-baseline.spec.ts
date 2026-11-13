import { expect, test } from "@playwright/test";
import path = require('path');

// La classe utilitaire .qc-formfield-row (définie dans components/Fieldset/_fieldset.scss)
// aligne des champs sur une même ligne : flex + gap horizontal de 32px, retour à la ligne
// (flex-wrap), marge basse neutralisée sur les champs, largeur d'input pilotée par `size`,
// .qc-select en width:fit-content, et un .qc-form-error enfant direct qui occupe 100 % de la
// largeur. Un unique snapshot visuel de la fixture — qui regroupe ces variantes — valide le rendu.
// Baseline seul (pas d'équivalent svelte) : entrée correspondante dans buildSvelteTestsIgnore.json.
test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/formfieldRowBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await page.evaluate(async () => {
        await Promise.all([
            (window as any).customElements?.whenDefined('qc-textfield'),
            (window as any).customElements?.whenDefined('qc-select'),
        ]);
        await (document as any).fonts?.ready;
    });
});

test.describe('Champs alignés (qc-formfield-row)', () => {
    test('rendu visuel de référence des rangées de champs', {
        tag: ['@baseline', '@formfield-row']
    }, async ({ page }) => {
        await expect(page).toHaveScreenshot('formfieldRow.png', { fullPage: true });
    });
});

/*
 * @mobile : aucune règle mobile pour ce composant, donc pas de baseline mobile.
 * Preuve (aucune règle de largeur, média-requête, vw, @container ni logique tactile) :
 *   $ grep -rnE 'clientWidth|innerWidth|matchMedia|grid\.json|touch(start|end|move)|touch-action|pointer-events|pointerType|@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row' src/sdg/components/FormfieldRow src/sdg/components/Label --exclude-dir=Test --exclude=*.html --exclude=*.ejs
 *   -> 0 résultat
 */
test.skip('formfield-row-baseline mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
