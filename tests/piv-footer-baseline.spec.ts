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
