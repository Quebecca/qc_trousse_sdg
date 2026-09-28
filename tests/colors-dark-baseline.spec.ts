import {expect, test} from "@playwright/test";
import path = require('path');

// Même jeu de test que colors-baseline, mais en THÈME SOMBRE (.qc-dark-theme sur :root,
// activé par un script dans la fixture). Le thème sombre ne change QUE les couleurs :
// ce snapshot dédié valide les overrides de tokens dark. Toute dérive d'une valeur dark
// (ou une couleur qui n'aurait pas d'override dark attendu) fait bouger la référence.
// Fixture séparée (et non un simple ajout au test clair) pour apparaître dans l'index
// des fixtures.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/colorsDarkBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Couleurs — thème sombre', () => {
    test('rendu visuel de référence de la palette (thème sombre)', {
        tag: ['@baseline', '@colors-dark']
    }, async ({page}) => {
        await expect(page).toHaveScreenshot('colors-dark.png', {fullPage: true});
    });
});
