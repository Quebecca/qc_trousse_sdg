import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/dropdownList.dev.html');
    page.goto(`file://${htmlFilePath}`).catch(console.error);
})

test('Soit Option 1 présélectionnée dans Choix unique, lorsque la page charge, alors Option 1 apparaît dans l\'input', async ({ page }) => {
    await expect(page.locator('#dropdown-list-single-choice-input')).toContainText('Option 1');
});

test('En cliquant sur un libellé, alors le liste est en focus', async ({ page }) => {
    await page.getByText('Choix unique:', { exact: true }).click();

    await expect(page.locator('#dropdown-list-single-choice-input')).toBeFocused();
});

test('En cliquant sur la liste déroulante, alors la popup s\'affiche', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();

    await expect(page.locator('#dropdown-list-single-choice-popup')).toBeVisible();
    await expect(page.locator('#dropdown-list-single-choice-input')).toHaveAttribute('aria-expanded', 'true');
});

test('En sélectionnant une option désactivée, alors rien ne se passe', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.getByRole('option', { name: 'Option 16 (désactivée)' }).click();

    await expect(page.locator('#dropdown-list-single-choice-popup')).toBeVisible();
});

test('En sélectionnant une option activée, alors referme la popup et affiche la nouvelle option sélectionnée', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.getByRole('option', { name: 'Option 5' }).click();

    await expect(page.locator('#dropdown-list-single-choice-popup')).toBeHidden();
    await expect(page.locator('#dropdown-list-single-choice-input')).toContainText('Option 5');
    await expect(page.locator('#dropdown-list-single-choice-input')).toHaveAttribute('aria-expanded', 'false');
});

test('Soit liste déroulante avec champ de recherche est ouverte, en tapant un caractère imprimable, alors ajoute le texte à la recherche', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique avec recherche:' }).click();
    await page.getByRole('searchbox', { name: 'Rechercher…' }).fill('12');

    await expect(page.locator('#dropdown-list-single-choice-no-scroll-search')).toHaveValue('12');

    await page.getByRole('button', { name: 'Effacer le texte' }).click();

    await expect(page.locator('#dropdown-list-single-choice-no-scroll-search')).toHaveValue('');
});

test('En sélectionnant des options de Choix multiples, alors la popup reste ouverte et affiche tous les choix', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix multiples:' }).click();
    await page.locator('label').filter({ hasText: 'Option 3' }).click();

    await expect(page.locator('#dropdown-list-multiple-choices-popup')).toBeVisible();

    await page.locator('#dropdown-list-multiple-choices-items').getByText('Option 4').click();

    await expect(page.locator('#dropdown-list-multiple-choices-popup')).toBeVisible();
});

test('En sélectionnant 2 options de choix multiples, alors les 2 options sont listées', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix multiples:' }).click();
    await page.locator('label').filter({ hasText: 'Option 3' }).click();
    await page.locator('label').filter({ hasText: 'Option 4' }).click();

    await expect(page.locator('#dropdown-list-multiple-choices-input')).toContainText('Option 3, Option 4');
});

test('En sélectionnant une option de Choix multiples et en la désélectionnant, alors aucune option n\'est listée', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix multiples:' }).click();
    await page.locator('label').filter({ hasText: 'Option 2' }).click();
    await page.locator('label').filter({ hasText: 'Option 2' }).click();

    await expect(page.locator('#dropdown-list-multiple-choices-input')).toContainText('');

});

test('Soit un formulaire de liste déroulante avec champ obligatoire vide, en cliquant sur envoyer, alors erreur affichée', async ({ page }) => {
    await page.getByRole('button', { name: 'Envoyer' }).click();

    await expect(page.locator('#dropdown-list-restaurants-input')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#dropdown-list-restaurants-error')).toMatchAriaSnapshot(`
        - alert:
          - img
          - text: Veuillez choisir un type de restaurant.
    `);
    // await page.getByRole('combobox', { name: 'Type de restaurant' }).click();
    // await page.getByRole('option', { name: 'Pâtisserie' }).click();
    // page.once('dialog', dialog => {
    //     console.log(`Dialog message: ${dialog.message()}`);
    //     dialog.dismiss().catch(() => {});
    // });
    // await page.getByRole('button', { name: 'Envoyer' }).click();
});
