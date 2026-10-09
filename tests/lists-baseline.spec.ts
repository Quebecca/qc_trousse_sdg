import {expect, test} from "@playwright/test";
import path = require('path');

// Les listes sont purement CSS (pas de composant). Un unique snapshot visuel de la fixture
// (ul disc + imbrication circle, ol numérotée + imbriquée, dl/dt/dd marges à 0, imbrication
// mixte ol/ul, et bornage à max-content-width) valide l'ensemble du rendu de _lists.scss.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/listsBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Listes', () => {
    test('rendu visuel de référence des listes', {
        tag: ['@baseline', '@lists']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('lists.png', {fullPage: true});
    });
});
