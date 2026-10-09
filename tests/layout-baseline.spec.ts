import {expect, test} from "@playwright/test";
import path = require('path');

// La base « layout » est purement CSS (pas de composant). Un unique snapshot visuel de la
// fixture valide les règles structurelles globales de _layout.scss : box-sizing border-box,
// échelle rem du :root, et police/couleurs héritées du body.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/layoutBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Layout', () => {
    test('rendu visuel de référence de la base layout', {
        tag: ['@baseline', '@layout']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('layout.png', {fullPage: true});
    });
});
