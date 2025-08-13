import { test, expect } from '@playwright/test';
import path = require('path');

test('Checkbox', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/checkbox.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot({fullPage: true});
});