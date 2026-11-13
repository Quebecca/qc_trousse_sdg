import { test, expect } from '@playwright/test';
import path = require('path');

// Baseline du composant qc-search-bar (WC posé en markup statique).
// Le spec -svelte est AUTO-GÉNÉRÉ depuis ce fichier (plugins/buildSvelteTests.mjs) :
// svelte et svelte partagent les mêmes snapshots PNG. Les localisateurs doivent
// donc fonctionner dans les DEUX DOM (host <qc-search-bar> vs .qc-search-bar direct)
// => cibler .qc-search-bar / input[type=search], jamais la balise qc-search-bar.

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/searchBarSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
    // Attendre l'upgrade du web-component (barre définie et rendue).
    await page.locator('input[type=search]').first().waitFor();
});

test('SearchBar svelte — variantes (défaut, valeur, fond PIV)', {
    tag: ['@svelte', '@search-bar']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('searchBar-variantes.png', { fullPage: true });
});

test('SearchBar svelte — champ focus', {
    tag: ['@svelte', '@search-bar']
}, async ({ page }) => {
    await page.locator('input[type=search]').first().focus();
    await expect(page).toHaveScreenshot('searchBar-focus.png', { fullPage: true });
});

test('SearchBar svelte — trois barres rendues avec bouton de recherche', {
    tag: ['@svelte', '@search-bar']
}, async ({ page }) => {
    await expect(page.locator('.qc-search-bar')).toHaveCount(3);
    // Un bouton submit (aria-label « Lancer la recherche ») par barre.
    await expect(page.getByRole('button', { name: 'Lancer la recherche' })).toHaveCount(3);
});

test('SearchBar svelte — la variante pré-remplie affiche le bouton d’effacement', {
    tag: ['@svelte', '@search-bar']
}, async ({ page }) => {
    const filled = page.locator('.cas-valeur input[type=search]');
    await expect(filled).toHaveValue('Climat');
    // Le bouton d'effacement (icône close) n'est présent que si le champ a une valeur.
    await expect(
        page.locator('.cas-valeur').getByRole('button', { name: 'Effacer le texte' })
    ).toBeVisible();
});

test('SearchBar svelte — saisir du texte fait apparaître le bouton d’effacement', {
    tag: ['@svelte', '@search-bar']
}, async ({ page }) => {
    const emptyBar = page.locator('.cas-defaut');
    const input = emptyBar.locator('input[type=search]');

    // Barre vide au départ : pas de bouton d'effacement.
    await expect(emptyBar.getByRole('button', { name: 'Effacer le texte' })).toHaveCount(0);

    await input.fill('recherche');
    await expect(input).toHaveValue('recherche');
    await expect(emptyBar.getByRole('button', { name: 'Effacer le texte' })).toBeVisible();
});

/*
 * @mobile : aucune règle mobile pour ce composant, donc pas de svelte mobile.
 * Preuve (aucune règle de largeur, média-requête, vw, @container ni logique tactile) :
 *   $ grep -rnE 'clientWidth|innerWidth|matchMedia|grid\.json|touch(start|end|move)|touch-action|pointer-events|pointerType|@media|@container|[0-9]vw|media-mobile|media-tablet|media-desktop|media-breakpoint|qc-container|qc-col-|qc-row' src/sdg/components/SearchBar --exclude-dir=Test --exclude=*.html --exclude=*.ejs
 *   -> 0 résultat
 */
test.skip('search-bar-svelte mobile : aucune règle mobile', {
    tag: ['@mobile']
}, async () => {});
