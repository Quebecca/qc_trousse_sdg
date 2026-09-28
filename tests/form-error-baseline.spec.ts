import {expect, test} from "@playwright/test";
import path = require('path');

// Le message d'erreur de champ (.qc-form-error) est purement CSS (pas de test
// svelte : entrée dans buildSvelteTestsIgnore.json). Un unique snapshot visuel de
// la fixture (message par défaut, message nommé, modificateur .qc-xs-mt et texte
// multiligne) valide le rendu du SCSS : couleur, icône, graisse, marges et
// alignement haut.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/formErrorBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Message d’erreur de champ', () => {
    test('rendu visuel de référence du message d’erreur', {
        tag: ['@baseline', '@form-error']
    }, async ({page}) => {
        // Attendre le chargement de la police d'icônes (Material Symbols) pour
        // un glyphe warning stable dans le snapshot.
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('form-error.png', {fullPage: true});
    });
});
