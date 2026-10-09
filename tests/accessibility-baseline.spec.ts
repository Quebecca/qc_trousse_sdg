import {expect, test} from "@playwright/test";
import path = require('path');

// Base « accessibility » : purement CSS, la seule classe livrée est .qc-sr-only
// (mixin sr-only — clip 1px, hors flux). On valide par snapshot que le contenu
// masqué n'occupe aucun espace visuel (texte sr-only, titre sr-only, skip-link).
//
// État PILOTÉ : le skip-link est focusé pour capturer son rendu au focus. La
// trousse ne fournit PAS de reveal-au-focus sur .qc-sr-only, donc le lien reste
// masqué même focusé — le snapshot fige et documente ce comportement (une
// éventuelle future règle :focus révélant le lien ferait diverger la référence).
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/accessibilityBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Accessibility (base)', () => {
    test('rendu visuel de référence : contenu sr-only masqué', {
        tag: ['@baseline', '@accessibility']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('accessibility.png', {fullPage: true});
    });

    test('skip-link focusé : .qc-sr-only reste masqué au focus', {
        tag: ['@baseline', '@accessibility']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await page.focus('#skip');
        await expect(page.locator('#skip')).toBeFocused();
        await expect(page).toHaveScreenshot('accessibility-skip-focus.png', {fullPage: true});
    });
});
