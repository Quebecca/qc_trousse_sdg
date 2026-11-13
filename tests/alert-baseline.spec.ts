import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/alertBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('Alert baseline', {
    tag: ['@alert', '@baseline']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('alert.png', { fullPage: true });
});

test('Fermeture d\'alerte', {
    tag: ['@alert', '@baseline']
}, async ({ page }) => {
    await page.getByRole('button', { name: 'Fermer l’alerte' }).click();
    await expect(page).toHaveScreenshot('alert-hide.png', { fullPage: true });

    await page.reload();
    await expect(page).toHaveScreenshot('alert-hide.png', { fullPage: true });
});

/*
 * @mobile : le SCSS d'Alert contient 3 règles media-mobile() (_alert.scss) :
 *   padding vertical md -> sm, taille du contenu md -> sm, et idem pour qc-alert:not(:defined).
 * Preuve : grep -n 'media-mobile' src/sdg/components/Alert/_alert.scss -> lignes 6, 32, 74.
 * Test adapté (pas de copie du desktop) : rendu mobile réel + valeurs calculées
 * du padding et de la taille de police. La fermeture reste couverte par le desktop.
 */
test('Alert baseline mobile', {
    tag: ['@alert', '@baseline', '@mobile']
}, async ({ page }) => {
    const alerte = page.locator('.qc-general-alert').first();
    await expect(alerte).toBeVisible();

    await expect(alerte).toHaveCSS('padding-top', '16px');
    await expect(alerte).toHaveCSS('padding-bottom', '16px');
    await expect(page.locator('.qc-alert-content').first()).toHaveCSS('font-size', '14px');

    await expect(page).toHaveScreenshot('alert-mobile.png', { fullPage: true });
});
