import { test, expect } from '@playwright/test';
import path = require('path');

test('textfield-ref textfield', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/textField.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('textField.png', {fullPage: true});
});
test('textfield svelte', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/textFieldEmbedded.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('textField.png', {fullPage: true});
});