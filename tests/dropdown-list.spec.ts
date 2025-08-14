import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/dropdownList.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('Test de rendu', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique avec recherche:' }).click();
    await page.getByRole('option', { name: 'Option 1', exact: true }).focus();
    await page.getByRole('option', { name: 'Option 2', exact: true }).hover();

    await expect(page).toHaveScreenshot({fullPage: true});
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

test('Soit une liste déroulante ouverte, lorsque navigation avec Tab, alors focus placé sur les options suivantes de la liste', async ({ page, browserName }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();

    await page.getByRole('combobox', { name: 'Choix unique:' }).press('Tab');
    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 1$/gm) })
    ).toBeFocused();

    await page.getByRole('option', { name: 'Option 1', exact: true }).press('Tab');
    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 2$/gm) })
    ).toBeFocused();

    await page.getByRole('option', { name: 'Option 2' }).press('Shift+Tab');
    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 1$/gm) })
    ).toBeFocused();

    await page.getByRole('option', { name: 'Option 1', exact: true }).press('Shift+Tab');

    if (browserName !== 'webkit') {
        await expect(page.locator('#dropdown-list-single-choice-input')).toBeFocused();
    } else {
        console.log(
            "La vérification du focus se fait incorrectement avec Webkit." +
            " Voir l'issue https://github.com/microsoft/playwright/issues/32269" +
            " et la PR https://github.com/microsoft/playwright/pull/31325"
        );
    }
});

test('Soit une liste déroulante ouverte, lorsque navigation avec flèches, alors focus placé sur les options suivantes de la liste', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();

    await page.getByRole('combobox', { name: 'Choix unique:' }).press('ArrowDown');
    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 1$/gm) })
    ).toBeFocused();

    await page.getByRole('option', { name: 'Option 1', exact: true }).press('ArrowDown');
    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 2$/gm) })
    ).toBeFocused();

    await page.getByRole('option', { name: 'Option 2' }).press('ArrowUp');
    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 1$/gm) })
    ).toBeFocused();

    await page.getByRole('option', { name: 'Option 1', exact: true }).press('ArrowUp');
    await expect(page.locator('#dropdown-list-single-choice-input')).toBeFocused();
});

test('Soit une liste déroulante ouverte, en cliquant à l\'extérieur de la liste, alors la popup se ferme', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.locator('div').filter({ hasText: 'Option 1 Option 2 Option 3' }).first().click();

    await expect(page.locator('#dropdown-list-single-choice-popup')).toBeHidden();
    await expect(page.locator('#dropdown-list-single-choice-input')).toHaveAttribute('aria-expanded', 'false');
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

test('En sélectionnant une option activée au clavier, alors referme la popup et affiche la nouvelle option sélectionnée', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.getByRole('combobox', { name: 'Choix unique:' }).press('ArrowDown');
    await page.locator('#dropdown-list-single-choice-items >> li')
        .filter({ has: page.getByText(/^Option 1$/gm) })
        .press('ArrowDown');
    await page.locator('#dropdown-list-single-choice-items >> li')
        .filter({ has: page.getByText(/^Option 2$/gm) })
        .press('ArrowDown');
    await page.locator('#dropdown-list-single-choice-items >> li')
        .filter({ has: page.getByText(/^Option 3$/gm) })
        .press('ArrowDown');
    await page.locator('#dropdown-list-single-choice-items >> li')
        .filter({ has: page.getByText(/^Option 4$/gm) })
        .press('ArrowDown');
    await page.locator('#dropdown-list-single-choice-items >> li')
        .filter({ has: page.getByText(/^Option 5$/gm) })
        .press('Enter');

    await expect(page.locator('#dropdown-list-single-choice-popup')).toBeHidden();
    await expect(page.locator('#dropdown-list-single-choice-input')).toContainText('Option 5');
    await expect(page.locator('#dropdown-list-single-choice-input')).toHaveAttribute('aria-expanded', 'false');
});

test('Soit focus placé sur la liste déroulante de Choix unique et liste ouverte,' +
    'en tapant flèche vers le haut, alors focus placé sur la dernière option',
    async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.getByRole('combobox', { name: 'Choix unique:' }).press('ArrowUp');

    await expect(page.getByRole('option', { name: 'Option 16' })).toBeFocused();
});

test('Soit une option sélectionnée, liste déroulante fermée et focus placé sur l\'input,' +
    'en tapant flèche du bas, alors le focus est placé sur l\'option sélectionnée', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.getByRole('option', { name: 'Option 5' }).click();
    await page.getByRole('combobox', { name: 'Choix unique:' }).press('ArrowDown');

    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 5$/gm) })
    ).toBeFocused();
});

test('Soit liste déroulante avec champ de recherche est ouverte, en tapant un caractère imprimable, alors ajoute le texte à la recherche', async ({ page, browserName }) => {
    await page.getByRole('combobox', { name: 'Choix unique avec recherche:' }).click();
    await page.getByRole('searchbox', { name: 'Rechercher...' }).fill('12');

    await expect(page.locator('#dropdown-list-single-choice-no-scroll-search')).toHaveValue('12');
    await expect(page.locator('#dropdown-list-single-choice-no-scroll-items')).toMatchAriaSnapshot(`
      - list:
        - option "Option 12"
      - status
    `);

    await page.getByRole('searchbox', { name: 'Rechercher...' }).press('Tab');
    if (browserName !== "webkit") {
        await expect(page.getByRole('button', { name: 'Effacer le texte' })).toBeFocused();
    } else {
        console.log(
            "La vérification du focus se fait incorrectement avec Webkit." +
            " Voir l'issue https://github.com/microsoft/playwright/issues/32269" +
            " et la PR https://github.com/microsoft/playwright/pull/31325"
        );
    }

    await page.getByRole('button', { name: 'Effacer le texte' }).click();

    await expect(page.locator('#dropdown-list-single-choice-no-scroll-search')).toHaveValue('');
    await expect(page.locator('#dropdown-list-single-choice-no-scroll-items')).toMatchAriaSnapshot(`
      - list:
        - option "Option 1"
        - option "Option 2"
        - option "Option 3"
        - option "Option 4"
        - option "Option 5"
        - option "Option 6"
        - option "Option 7"
        - option "Option 8"
        - option "Option 9"
        - option "Option 10"
        - option "Option 11"
        - option "Option 12"
        - option "Option 13"
        - option "Option 14"
        - option "Option 15"
        - option "Option 16"
      - status
    `);

    await page.getByRole('searchbox', { name: 'Rechercher...' }).fill('12');
    await page.getByRole('combobox', { name: 'Choix unique avec recherche:' }).click();
    await page.getByRole('combobox', { name: 'Choix unique avec recherche:' }).click();
    await expect(page.locator('#dropdown-list-single-choice-no-scroll-search')).toHaveValue('');
    await expect(page.locator('#dropdown-list-single-choice-no-scroll-items')).toMatchAriaSnapshot(`
      - list:
        - option "Option 1"
        - option "Option 2"
        - option "Option 3"
        - option "Option 4"
        - option "Option 5"
        - option "Option 6"
        - option "Option 7"
        - option "Option 8"
        - option "Option 9"
        - option "Option 10"
        - option "Option 11"
        - option "Option 12"
        - option "Option 13"
        - option "Option 14"
        - option "Option 15"
        - option "Option 16"
      - status
    `);
});

test('Soit liste déroulante sans champ de recherche, en tapant un caractère imprimable, alors focus sur le premier élément correspondant', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.getByRole('combobox', { name: 'Choix unique:' }).press('1');
    await page.locator('#dropdown-list-single-choice-items >> li')
        .filter({ has: page.getByText(/^Option 1$/gm) })
        .press('2');

    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 12$/gm) })
    ).toBeFocused();

    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.getByRole('combobox', { name: 'Choix unique:' }).click();
    await page.getByRole('combobox', { name: 'Choix unique:' }).press('1');
    await page.locator('#dropdown-list-single-choice-items >> li')
        .filter({ has: page.getByText(/^Option 1$/gm) })
        .press('2');

    await expect(
        page.locator('#dropdown-list-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 12$/gm) })
    ).toBeFocused();
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

test('Soit un formulaire de liste déroulante avec champ obligatoire vide, en cliquant sur envoyer, alors erreur affichée et peut être ensuite retirée', async ({ page }) => {
    await page.getByRole('button', { name: 'Envoyer' }).click();

    await expect(page.locator('#dropdown-list-restaurants-input')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#dropdown-list-restaurants-error')).toMatchAriaSnapshot(`
        - alert:
          - img
          - text: Veuillez choisir un type de restaurant.
    `);

    await page.getByRole('combobox', { name: 'Type de restaurant' }).click();
    await page.getByRole('option', { name: 'Pâtisserie' }).click();

    await expect(page.locator('#dropdown-list-restaurants-error')).toHaveCount(0);
});

test('Soit un formulaire de liste déroulante avec champ obligatoire vide, en sélectionnant une option et en soumettant, alors alerte d\'envoi de donnée affichée', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Type de restaurant' }).click();
    await page.getByRole('option', { name: 'Pâtisserie' }).click();
    await page.getByRole('button', { name: 'Envoyer' }).click();

    await expect(page.locator('#dropdown-list-restaurants-input')).toHaveAttribute('aria-invalid', 'false');
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe(
            'Formulaire soumis avec les données suivantes :\n' +
            'Type de restaurant: Pâtisserie\n' +
            'Régions desservies: Centre-du-Québec, Montérégie'
        );
        await dialog.accept();
    });
});
