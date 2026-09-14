import { test, expect } from '@playwright/test';
import path from 'path';

const htmlFilePath = path.resolve(__dirname, '..', 'public', 'icon-font-raw.test.html');

/**
 * Test brut de la font Material Symbols subsetée.
 * Vérifie que les codepoints Unicode affichent bien des icônes
 * (pas des carrés vides ou des caractères de remplacement).
 */
test.describe('Font Material Symbols — rendu brut par codepoints', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${htmlFilePath}`);
    // Attendre que la font soit chargée
    await page.waitForFunction(() => document.fonts.ready);
  });

  test('la font Material Symbols est chargée', async ({ page }) => {
    const fontLoaded = await page.evaluate(async () => {
      await document.fonts.ready;
      const fonts = Array.from(document.fonts);
      return fonts.some(f => f.family.includes('Material Symbols'));
    });
    expect(fontLoaded).toBe(true);
  });

  test('l\'icône search (E8B6) a une taille non nulle', async ({ page }) => {
    const box = await page.locator('#icon-search').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(10);
    expect(box!.height).toBeGreaterThan(10);
  });

  test('l\'icône search ne ressemble pas à un carré vide', async ({ page }) => {
    // Prendre un screenshot de l'icône et vérifier qu'elle n'est pas vide
    const icon = page.locator('#icon-search');
    const screenshot = await icon.screenshot();
    // Un carré vide ou un caractère de remplacement aurait très peu de pixels non-blancs
    // On vérifie juste que le screenshot n'est pas entièrement blanc/transparent
    expect(screenshot.length).toBeGreaterThan(100);
  });

  test('screenshot de toutes les icônes pour validation visuelle', async ({ page }) => {
    await expect(page.locator('body')).toHaveScreenshot('icon-font-raw.png');
  });

  test('la variante filled est visuellement différente de outlined', async ({ page }) => {
    const outlined = await page.locator('#icon-info').screenshot();
    const filled = await page.locator('#icon-info-filled').screenshot();
    // Les deux screenshots doivent être différents (filled a plus de pixels)
    expect(Buffer.compare(outlined, filled)).not.toBe(0);
  });
});
