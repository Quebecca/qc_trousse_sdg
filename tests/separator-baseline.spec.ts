import {expect, test} from "@playwright/test";
import path = require('path');

// Le séparateur est purement CSS (pas de composant). Un unique snapshot visuel de la
// fixture (<hr> entre paragraphes, en série, seul, et dans un conteneur étroit) valide
// l'ensemble du rendu du mixin `ruler()` : marge verticale, reset border et
// border-bottom gris clair.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/separatorBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Séparateur', () => {
    test('rendu visuel de référence du séparateur', {
        tag: ['@baseline', '@separator']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('separator.png', {fullPage: true});
    });
});
