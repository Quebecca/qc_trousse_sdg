import { test, expect } from '@playwright/test';
import path = require('path');

/* test des composants web de la trousse */
test('button baseline', {
    tag: ['@baseline', '@button']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/buttonBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await expect(page).toHaveScreenshot('button.png', { fullPage: true });
});

/*
 * @mobile : aucune règle mobile pour ce composant, donc pas de baseline mobile.
 * Preuve (aucune règle de largeur, média-requête, vw, @container ni logique tactile) :
 *   $ grep -rnE 'clientWidth|innerWidth|matchMedia|grid\.json|touch(start|end|move)|touch-action|pointer-events|pointerType|@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row' src/sdg/components/Button --exclude-dir=Test --exclude=*.html --exclude=*.ejs
 *   -> 0 résultat
 */
test.skip('button-baseline mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
