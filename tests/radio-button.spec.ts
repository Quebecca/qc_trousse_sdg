import { test, expect } from '@playwright/test';
import path = require('path');

test('Radios', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/radios.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot({fullPage: true});
});