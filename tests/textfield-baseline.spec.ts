import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/textFieldBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
})

/* test des composants web de la trousse */
test('textfield baseline', {
    tag: ['@baseline', '@textfield']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('textField.png', {fullPage: true});
});

test.describe('Aria', () => {
    test('aria-required', async ({ page }) => {
        await expect(page.locator('#text-lg')).toHaveAttribute('aria-required', 'true');
    });

    test('aria-invalid', async ({ page }) => {
        await expect(page.locator('#text-md')).toHaveAttribute('aria-invalid', 'true');

        await page.locator('#text-md').click();
        await page.locator('#text-md').fill('1');
        await expect(page.locator('#text-md')).toHaveAttribute('aria-invalid', 'false');
    });
});

/*
 * @mobile : aucune règle mobile pour ce composant, donc pas de baseline mobile.
 * Preuve (aucune règle de largeur, média-requête, vw, @container ni logique tactile) :
 *   $ grep -rnE 'clientWidth|innerWidth|matchMedia|grid\.json|touch(start|end|move)|touch-action|pointer-events|pointerType|@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row' src/sdg/components/TextField --exclude-dir=Test --exclude=*.html --exclude=*.ejs
 *   -> 0 résultat
 */
test.skip('textfield-baseline mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
