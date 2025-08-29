import { test, expect } from '@playwright/test';
import path = require('path');

/* test des composants web de la trousse */
test('textfield ref', {
    tag: ['@svelte', '@textfield']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/textFieldSvelte.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('textField.png', {fullPage: true});
});
