import {expect, test} from "@playwright/test";
import path = require('path');

// La scrollbar stylée est purement CSS (_scrollbar.scss, pas de composant). Un unique snapshot
// visuel de la fixture (défilement direct de .qc-scrollbar + défilement d'un descendant) valide
// le rendu : largeur du couloir, pouce bleu PIV arrondi, piste transparente.
//
// ⚠️ FRAGILITÉ inter-navigateur/OS : le style ::-webkit-scrollbar n'est honoré que par les moteurs
// WebKit/Blink (chromium, webkit). Firefox ignore ::-webkit-scrollbar et applique le repli
// scrollbar-color/scrollbar-width -> son rendu (et donc son snapshot) diffère par nature. De plus
// la largeur/le rendu exact du couloir dépend de l'OS. Les PNG de référence sont donc générés par
// projet (chromium/firefox/webkit) et restent sensibles à la plateforme : à régénérer via le
// conteneur linux (yarn test) avant livraison si l'écart local dépasse la tolérance.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/scrollbarBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Scrollbar', () => {
    test('rendu visuel de référence de la scrollbar stylée', {
        tag: ['@baseline', '@scrollbar']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('scrollbar.png', {fullPage: true});
    });
});
