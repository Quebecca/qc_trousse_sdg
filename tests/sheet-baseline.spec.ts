import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/sheetBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('Sheet baseline — rendu initial (fermée)', {
    tag: ['@sheet', '@baseline']
}, async ({ page }) => {
    // Aucun dialog ouvert au chargement
    const dialog = page.locator('.qc-sheet-dialog');
    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveScreenshot('sheet-closed.png', { fullPage: true });
});

test('Sheet — ouverture avec titre', {
    tag: ['@sheet', '@baseline']
}, async ({ page }) => {
    await page.click('#btn-sheet-title');
    const dialog = page.locator('.qc-sheet-dialog');
    await expect(dialog).toBeVisible();
    await expect(page).toHaveScreenshot('sheet-open-title.png', { fullPage: true });
});

test('Sheet — ouverture sans titre', {
    tag: ['@sheet', '@baseline']
}, async ({ page }) => {
    await page.click('#btn-sheet-no-title');
    const dialog = page.locator('.qc-sheet-dialog');
    await expect(dialog).toBeVisible();
    await expect(page).toHaveScreenshot('sheet-open-no-title.png', { fullPage: true });
});

test('Sheet — fermeture par bouton X', {
    tag: ['@sheet', '@baseline']
}, async ({ page }) => {
    await page.click('#btn-sheet-title');
    const dialog = page.locator('.qc-sheet-dialog');
    await expect(dialog).toBeVisible();

    await page.click('.qc-sheet-close');
    await expect(dialog).toHaveCount(0);
});

test('Sheet — fermeture par touche Échap', {
    tag: ['@sheet', '@baseline']
}, async ({ page }) => {
    await page.click('#btn-sheet-title');
    const dialog = page.locator('.qc-sheet-dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
});

test('Sheet — fermeture par clic sur le backdrop', {
    tag: ['@sheet', '@baseline']
}, async ({ page }) => {
    await page.click('#btn-sheet-title');
    const dialog = page.locator('.qc-sheet-dialog');
    await expect(dialog).toBeVisible();

    // Le backdrop (::backdrop) couvre le haut de l'écran, au-dessus du panel.
    // Cliquer tout en haut du viewport, hors du panel, déclenche handleBackdropClick.
    await page.mouse.click(10, 10);
    await expect(dialog).toHaveCount(0);
});

test('Sheet — focus sur le titre à l\'ouverture', {
    tag: ['@sheet', '@baseline', '@a11y']
}, async ({ page }) => {
    await page.click('#btn-sheet-title');
    const title = page.locator('.qc-sheet-title');
    await expect(title).toBeFocused();
});

test('Sheet — retour du focus au bouton déclencheur à la fermeture', {
    tag: ['@sheet', '@baseline', '@a11y']
}, async ({ page }) => {
    const trigger = page.locator('#btn-sheet-title');
    await trigger.click();
    await expect(page.locator('.qc-sheet-dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.qc-sheet-dialog')).toHaveCount(0);

    // Le retour de focus est reporté (requestAnimationFrame) : on interroge
    // document.activeElement en boucle plutôt que de tester une seule fois.
    await expect.poll(
        () => page.evaluate(() => document.activeElement?.id)
    ).toBe('btn-sheet-title');
});

test('Sheet — ARIA : aria-labelledby quand titre présent', {
    tag: ['@sheet', '@baseline', '@a11y']
}, async ({ page }) => {
    await page.click('#btn-sheet-title');
    const dialog = page.locator('.qc-sheet-dialog');
    const labelledby = await dialog.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    // Le titre référencé doit exister et contenir le texte
    const title = page.locator(`#${labelledby}`);
    await expect(title).toHaveText('Titre de la feuille');
});

test('Sheet — ARIA : aria-label générique quand pas de titre', {
    tag: ['@sheet', '@baseline', '@a11y']
}, async ({ page }) => {
    await page.click('#btn-sheet-no-title');
    const dialog = page.locator('.qc-sheet-dialog');
    await expect(dialog).toHaveAttribute('aria-label', 'Feuille');
    // Pas d'aria-labelledby
    const labelledby = await dialog.getAttribute('aria-labelledby');
    expect(labelledby).toBeNull();
});

test('Sheet — dimensions : max 1/3 viewport, min 320px', {
    tag: ['@sheet', '@baseline']
}, async ({ page }) => {
    await page.click('#btn-sheet-title');
    const dialog = page.locator('.qc-sheet-dialog');
    const maxHeight = await dialog.evaluate(el => getComputedStyle(el).maxHeight);
    const minHeight = await dialog.evaluate(el => getComputedStyle(el).minHeight);
    // max-height doit être environ 1/3 du viewport
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const maxHeightPx = parseFloat(maxHeight);
    expect(maxHeightPx).toBeCloseTo(viewportHeight / 3, -1);
    expect(parseFloat(minHeight)).toBeGreaterThanOrEqual(300); // ~320px en rem
});

test('Sheet — bouton fermeture est un <button>, pas un <a>', {
    tag: ['@sheet', '@baseline', '@a11y']
}, async ({ page }) => {
    await page.click('#btn-sheet-title');
    const closeBtn = page.locator('.qc-sheet-close');
    const tagName = await closeBtn.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('button');
});
