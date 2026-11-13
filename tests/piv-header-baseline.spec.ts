import { test, expect } from '@playwright/test';
import path = require('path');


test('pivHeader baseline', {
    tag: ['@baseline', '@piv-header']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/pivHeaderBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await page.getByRole('link', { name: 'Logo du gouvernement du Québec' }).first().focus();

    await expect(page).toHaveScreenshot('pivHeader.png', { fullPage: true });
});

/*
 * @mobile : le composant a des règles mobile (SCSS : media-mobile() = logo flexible,
 * titre masqué dans .piv-top et réaffiché sous la barre, zone droite compressée,
 * @media (max-width: 400px) = piv-top en wrap) et une interaction à la pointe du doigt
 * (bouton de recherche qui affiche/masque le formulaire).
 * Preuve :
 *   $ grep -nE '@media|media-mobile' src/sdg/components/PivHeader/_pivHeader.scss
 *   -> lignes 118, 130, 199, 227
 *   $ grep -n 'onclick\|displaySearchForm' src/sdg/components/PivHeader/PivHeader.svelte
 *   -> bascule displaySearchForm au clic du bouton .qc-search
 * Test adapté : rendu mobile de la page de fixtures, puis tap sur la recherche
 * de l'en-tête personnalisé (ouvert par défaut) pour valider sa fermeture.
 */
test.describe('PivHeader mobile', () => {
    test.beforeEach(async ({ page }) => {
        const htmlFilePath = path.resolve(__dirname, '../public/pivHeaderBaseline.test.html');
        await page.goto(`file://${htmlFilePath}`);
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
    });

    test('rendu mobile', {
        tag: ['@baseline', '@piv-header', '@mobile']
    }, async ({ page }) => {
        await expect(page).toHaveScreenshot('pivHeader-mobile.png', { fullPage: true });
    });

    test('tap sur la recherche : le formulaire se referme', {
        tag: ['@baseline', '@piv-header', '@mobile']
    }, async ({ page }) => {
        const header = page.locator('#pivEnteteExempleRecherchePersonnalisee qc-piv-header');
        const searchBar = header.locator('qc-search-bar');
        await expect(searchBar).toBeVisible();

        await header.locator('a.qc-search').tap();

        await expect(searchBar).toBeHidden();
        await expect(page).toHaveScreenshot('pivHeader-mobile-recherche-fermee.png', { fullPage: true });
    });
});
