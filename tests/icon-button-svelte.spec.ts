import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/iconButtonSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
    // Le bouton-icône rend des glyphes Material via la police : attendre son chargement.
    await page.waitForFunction(() => (document as any).fonts.ready);
});

test('IconButton svelte', {
    tag: ['@svelte', '@icon-button']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('iconButton.png', { fullPage: true });
});

/*
 * @mobile : aucune règle mobile pour ce composant, donc pas de svelte mobile.
 * Preuve (aucune règle de largeur, média-requête, vw, @container ni logique tactile) :
 *   $ grep -rnE 'clientWidth|innerWidth|matchMedia|grid\.json|touch(start|end|move)|touch-action|pointer-events|pointerType|@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row' src/sdg/components/IconButton --exclude-dir=Test --exclude=*.html --exclude=*.ejs
 *   -> 0 résultat
 */
test.skip('icon-button-svelte mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
