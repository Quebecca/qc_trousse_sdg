import {test, expect} from "@playwright/test";
import path = require('path');

test.beforeEach(async({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/alertBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('alert baseline', {
    tag: ['@baseline', '@alert']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('alert.png', {fullPage: true});
});

test('fermeture alerte', {
    tag: ['@baseline', '@alert', '@interaction'],
    annotation: {
        type: 'description',
        description: 'En cliquant sur le X d\'une alerte masquable, alors l\'alerte disparait.'
    }
}, async ({ page }) => {
    await page.getByRole('button', { name: 'Fermer l’alerte' }).click();
    await expect(page).toHaveScreenshot('alert-masked.png', {fullPage: true});
})