import {expect, test} from "@playwright/test";
import path = require('path');

// La base « colors » est purement CSS (aucun composant) : le mixin generate-color-classes
// génère une classe utilitaire .qc-bg-color-<chemin> par feuille de la map de couleurs.
// Un unique snapshot visuel de la fixture — une pastille par classe générée, groupée par
// famille (bleus, gris, rouges/roses, verts, jaunes, alias fonctionnels, liens, champs) —
// valide l'intégralité de la palette. Toute couleur ajoutée, retirée ou retargetée fait
// bouger le snapshot de référence.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/colorsBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Couleurs', () => {
    test('rendu visuel de référence de la palette', {
        tag: ['@baseline', '@colors']
    }, async ({page}) => {
        // Police web « Open Sans » (embarquée via @font-face) : on garantit son
        // chargement avant la capture, sinon FOUT -> capture avec la police de repli.
        await page.evaluate(async () => {
            await Promise.all([
                (document as any).fonts.load("400 14px 'Open Sans'"),
                (document as any).fonts.load("700 16px 'Open Sans'"),
            ]);
            await (document as any).fonts.ready;
        });
        await expect(page).toHaveScreenshot('colors.png', {fullPage: true});
    });
});
