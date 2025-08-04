import { test, expect } from '@playwright/test';
import path = require('path');

test('test', async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/radioButton.dev.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await page.locator('#exemple-radio-md').getByText('Option 2').click();
        await page.getByRole('button', { name: 'Soumettre' }).click();
        await expect(page.locator('#radio-group')).toMatchAriaSnapshot(`
          - group "Quel est votre niveau de scolarité?":
            - radio "Secondaire"
            - radio "Professionnel"
            - radio "Collégial"
            - radio "Universitaire"
            - alert:
              - img
              - text: Veuillez sélectionner un niveau de scolarité.
          `);
        await page.getByText('Universitaire', { exact: true }).click();
        await expect(page.locator('#radio-group')).toMatchAriaSnapshot(`
          - group "Quel est votre niveau de scolarité?":
            - radio "Secondaire"
            - radio "Professionnel"
            - radio "Collégial"
            - radio "Universitaire" [checked]
          `);
        page.once('dialog', dialog => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialog.dismiss().catch(() => {});
        });
        await page.getByRole('button', { name: 'Soumettre' }).click();

});