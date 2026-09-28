import { test, expect } from '@playwright/test';
import path = require('path');

// Le composant Retour en haut (<qc-to-top>) est piloté par du CSS + de la logique
// Svelte : positionnement fixe et visibilité dépendante du défilement (masqué par
// défaut, révélé au scroll vers le haut). En mode `demo="true"` (celui de la doc),
// cette logique est court-circuitée : le bouton est monté visible et dans le flux,
// ce qui donne un rendu déterministe — l'arbitre visuel de référence. On y ajoute
// l'état :focus, piloté depuis le spec (comme tooltip-baseline pilote son WC).
// Le snapshot est partagé avec le test svelte auto-généré (mêmes noms de PNG).

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/toTopBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await page.evaluate(async () => { await (document as any).fonts?.ready; });
});

test('ToTop baseline', {
    tag: ['@to-top', '@baseline']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('to-top.png', { fullPage: true });
});

test('ToTop état focus', {
    tag: ['@to-top', '@baseline']
}, async ({ page }) => {
    await page.locator('a.qc-to-top').first().focus();
    await expect(page).toHaveScreenshot('to-top-focus.png', { fullPage: true });
});
