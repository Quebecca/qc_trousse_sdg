import {expect, test} from "@playwright/test";
import path = require('path');

// Les titres sont purement CSS (pas de composant). Un unique snapshot visuel de la fixture
// (balises natives hN, classes .qc-hN et .qc-heading-<taille>, découplage, surtitre dans un
// hgroup et dans un h1) valide l'ensemble du rendu.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/headings.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Titres', () => {
    test('rendu visuel de référence des titres', {
        tag: ['@baseline', '@headings']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('headings.png', {fullPage: true});
    });
});
