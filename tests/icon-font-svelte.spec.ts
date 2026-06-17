import { test, expect } from '@playwright/test';
import path from 'path';

const htmlFilePath = path.resolve(__dirname, '..', 'public', 'icon-font-demo.dev.html');

/**
 * Test Playwright du mode font via la page de démo (Web Component <qc-icon render-mode="font">).
 * Vérifie le chargement de la font et prend des screenshots pour validation visuelle.
 */
test.describe('Icon font — rendu via Web Component', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${htmlFilePath}`);
    // Attendre que la font Material Symbols soit chargée
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

  test('les icônes ont une taille non nulle', async ({ page }) => {
    // Vérifier que la première icône de la grille a une bounding box valide
    const icon = page.locator('.icon-card qc-icon').first();
    const box = await icon.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(5);
    expect(box!.height).toBeGreaterThan(5);
  });

  test('screenshot — grille complète des icônes', async ({ page }) => {
    await expect(page.locator('.icon-grid')).toHaveScreenshot('icon-font-grid.png');
  });

  test('screenshot — variantes outlined vs filled', async ({ page }) => {
    // Localiser la section des variantes (après le h2 "Variantes")
    const section = page.locator('h2:has-text("Variantes") + .sizes-row');
    await expect(section).toHaveScreenshot('icon-font-variants.png');
  });

  test('screenshot — tailles xs à xl', async ({ page }) => {
    // Localiser la section des tailles (après le h2 "Tailles")
    const section = page.locator('h2:has-text("Tailles") + .sizes-row');
    await expect(section).toHaveScreenshot('icon-font-sizes.png');
  });

  test('screenshot — couleurs', async ({ page }) => {
    // Localiser la section des couleurs (après le h2 "Couleurs")
    const section = page.locator('h2:has-text("Couleurs") + .sizes-row');
    await expect(section).toHaveScreenshot('icon-font-colors.png');
  });

  test('la variante filled est visuellement différente de outlined', async ({ page }) => {
    // Comparer les deux premières icônes de la section variantes
    const variantsRow = page.locator('h2:has-text("Variantes") + .sizes-row');
    const outlined = variantsRow.locator('div').nth(0);
    const filled = variantsRow.locator('div').nth(1);

    const outlinedScreenshot = await outlined.screenshot();
    const filledScreenshot = await filled.screenshot();

    // Les deux doivent être visuellement différents
    expect(Buffer.compare(outlinedScreenshot, filledScreenshot)).not.toBe(0);
  });
});
