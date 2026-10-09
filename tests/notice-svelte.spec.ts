import {expect, test} from "@playwright/test";
import path = require('path');

// Le composant Avis (<qc-notice>) est rendu par une combinaison de CSS et de logique
// Svelte (types, icônes, rôles ARIA). Un unique snapshot visuel de la fixture — qui
// couvre les 6 types, les deux modes de contenu (attribut vs slot), le niveau de titre
// personnalisé, la surcharge d'icône et le repli d'un type invalide — valide l'ensemble
// du rendu. Le snapshot est partagé avec le test svelte auto-généré (même nom notice.png).
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/noticeSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Avis', () => {
    test('rendu visuel de référence des avis', {
        tag: ['@svelte', '@notice']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('notice.png', {fullPage: true});
    });
});
