import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/dropdownList.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Rendu visuel',
    () => {
    test('Select ref', async ({ page }) => {
        await page.locator('#qc-select-single-choice-search-input').click();
        await page.locator('#qc-select-single-choice-search-Option-1-1').focus();
        await page.locator('#qc-select-single-choice-search-Option-2-2').hover();

        await expect(page).toHaveScreenshot({fullPage: true});
    });

    test('Select svelte', async ({ page }) => {
        const htmlFilePath = path.resolve(__dirname, '../public/dropdownListEmbedded.test.html');
        await page.goto(`file://${htmlFilePath}`);

        await page.locator('#dropdown-list-single-choice-no-scroll-input').click();
        await page.locator('#dropdown-list-single-choice-no-scroll-Option-1-1').focus();
        await page.locator('#dropdown-list-single-choice-no-scroll-Option-2-2').hover();

        await expect(page).toHaveScreenshot({fullPage: true});
    });
});

test.describe('Interactions sélection unique', () => {
        test('Clic sur libellé', {
                annotation: {
                    type: 'description',
                    description: 'En cliquant sur un libellé, alors le liste est en focus'
                }
            },
            async ({ page }) => {
                await page.locator('#qc-select-single-choice-label').click();

                await expect(page.locator('#qc-select-single-choice-input')).toBeFocused();
            });

        test('Clic sur input', {
            annotation: {
                type: 'description',
                description: 'En cliquant sur la liste déroulante, alors la popup s\'affiche'
            }
        }, async ({ page }) => {
            await page.locator('#qc-select-single-choice-input').click();

            await expect(page.locator('#qc-select-single-choice-popup')).toBeVisible();
            await expect(page.locator('#qc-select-single-choice-input')).toHaveAttribute('aria-expanded', 'true');
        });

        test('Navigation avec Tab', {
                annotation: {
                    type: 'description',
                    description: 'Soit une liste déroulante ouverte, lorsque navigation avec Tab, alors focus placé sur les options suivantes de la liste'
                }
            },
            async ({ page, browserName }) => {
                await page.locator('#qc-select-single-choice-input').click();

                await page.locator('#qc-select-single-choice-input').press('Tab');
                await expect(
                    page.locator('#qc-select-single-choice-items >> li')
                        .filter({ has: page.getByText(/^Option 1$/gm) })
                ).toBeFocused();

                await page.locator('[id="qc-select-single-choice-Option-1-1"]').press('Tab');
                await expect(
                    page.locator('#qc-select-single-choice-items >> li')
                        .filter({ has: page.getByText(/^Option 2$/gm) })
                ).toBeFocused();

                await page.locator('[id="qc-select-single-choice-Option-2-2"]').press('Shift+Tab');
                await expect(
                    page.locator('#qc-select-single-choice-items >> li')
                        .filter({ has: page.getByText(/^Option 1$/gm) })
                ).toBeFocused();

                await page.locator('[id="qc-select-single-choice-Option-1-1"]').press('Shift+Tab');

                if (browserName !== 'webkit') {
                    await expect(page.locator('#qc-select-single-choice-input')).toBeFocused();
                } else {
                    console.log(
                        "La vérification du focus se fait incorrectement avec Webkit." +
                        " Voir l'issue https://github.com/microsoft/playwright/issues/32269" +
                        " et la PR https://github.com/microsoft/playwright/pull/31325"
                    );
                }
            });

        test('Navigation avec flèches', {
            annotation: {
                type: 'description',
                description: 'Soit une liste déroulante ouverte, lorsque navigation avec flèches, alors focus placé sur les options suivantes de la liste'
            }
        }, async ({ page }) => {
            await page.locator('#qc-select-single-choice-input').click();

            await page.locator('#qc-select-single-choice-input').press('ArrowDown');
            await expect(
                page.locator('#qc-select-single-choice-items >> li')
                    .filter({ has: page.getByText(/^Option 1$/gm) })
            ).toBeFocused();

            await page.locator('[id="qc-select-single-choice-Option-1-1"]').press('ArrowDown');
            await expect(
                page.locator('#qc-select-single-choice-items >> li')
                    .filter({ has: page.getByText(/^Option 2$/gm) })
            ).toBeFocused();

            await page.locator('[id="qc-select-single-choice-Option-2-2"]').press('ArrowUp');
            await expect(
                page.locator('#qc-select-single-choice-items >> li')
                    .filter({ has: page.getByText(/^Option 1$/gm) })
            ).toBeFocused();

            await page.locator('[id="qc-select-single-choice-Option-1-1"]').press('ArrowUp');
            await expect(page.locator('#qc-select-single-choice-input')).toBeFocused();
        });

        test('Clic extérieur', {
            annotation: {
                type: 'description',
                description: 'Soit une liste déroulante ouverte, en cliquant à l\'extérieur de la liste, alors la popup se ferme'
            }
        }, async ({ page }) => {
            await page.locator('#qc-select-single-choice-input').click();
            await page.locator('div').filter({ hasText: 'Option 1 Option 2 Option 3' }).first().click();

            await expect(page.locator('#qc-select-single-choice-popup')).toBeHidden();
            await expect(page.locator('#qc-select-single-choice-input')).toHaveAttribute('aria-expanded', 'false');
        });

        test('Sélection option désactivée', {
            annotation: {
                type: 'description',
                description: 'En sélectionnant une option désactivée, alors rien ne se passe'
            }
        }, async ({ page }) => {
            await page.locator('#qc-select-single-choice-input').click();
            await page.locator('[id="qc-select-single-choice-Option-16 désactivée-16"]').click();

            await expect(page.locator('#qc-select-single-choice-popup')).toBeVisible();
        });

        test('Sélection choix unique', {
            annotation: {
                type: 'description',
                description: 'En sélectionnant une option activée, alors referme la popup et affiche la nouvelle option sélectionnée'
            }
        }, async ({ page }) => {
            await page.locator('#qc-select-single-choice-input').click();
            await page.locator('[id="qc-select-single-choice-Option-5-5"]').click();

            await expect(page.locator('#qc-select-single-choice-popup')).toBeHidden();
            await expect(page.locator('#qc-select-single-choice-input')).toContainText('Option 5');
            await expect(page.locator('#qc-select-single-choice-input')).toHaveAttribute('aria-expanded', 'false');
        });

        test('Sélection choix unique avec Entrée', {
            annotation: {
                type: 'description',
                description: 'En sélectionnant une option activée au clavier, alors referme la popup et affiche la nouvelle option sélectionnée'
            }
        }, async ({ page }) => {
            await page.locator('#qc-select-single-choice-input').click();
            await page.locator('#qc-select-single-choice-input').press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 1$/gm) })
                .press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 2$/gm) })
                .press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 3$/gm) })
                .press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 4$/gm) })
                .press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 5$/gm) })
                .press('Enter');

            await expect(page.locator('#qc-select-single-choice-popup')).toBeHidden();
            await expect(page.locator('#qc-select-single-choice-input')).toContainText('Option 5');
            await expect(page.locator('#qc-select-single-choice-input')).toHaveAttribute('aria-expanded', 'false');
        });

        test('Sélection choix unique avec Espace', {
            annotation: {
                type: 'description',
                description: 'En sélectionnant une option activée avec Espace, alors referme la popup et affiche la nouvelle option sélectionnée'
            }
        }, async ({ page }) => {
            await page.locator('#qc-select-single-choice-input').click();
            await page.locator('#qc-select-single-choice-input').press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 1$/gm) })
                .press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 2$/gm) })
                .press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 3$/gm) })
                .press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 4$/gm) })
                .press('ArrowDown');
            await page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 5$/gm) })
                .press(' ');

            await expect(page.locator('#qc-select-single-choice-popup')).toBeHidden();
            await expect(page.locator('#qc-select-single-choice-input')).toContainText('Option 5');
            await expect(page.locator('#qc-select-single-choice-input')).toHaveAttribute('aria-expanded', 'false');
        });

        test('Navigation vers dernière option avec flèche vers le haut',
            {
                annotation: {
                    type: 'description',
                    description: 'Soit focus placé sur la liste déroulante de Choix unique et liste ouverte, en tapant flèche vers le haut, alors focus placé sur la dernière option'
                }
            },
            async ({ page }) => {
                await page.locator('#qc-select-single-choice-input').click();
                await page.locator('#qc-select-single-choice-input').press('ArrowUp');

                await expect(page.locator('[id="qc-select-single-choice-Option-16 désactivée-16"]')).toBeFocused();
            });

        test('Flèche du bas sur liste déroulante fermée', {
            annotation: {
                type: 'description',
                description: 'Soit une option sélectionnée, liste déroulante fermée et focus placé sur l\'input, en tapant flèche du bas, alors le focus est placé sur l\'option sélectionnée'
            }
        }, async ({ page }) => {
            await page.locator('#qc-select-single-choice-input').click();
            await page.locator('[id="qc-select-single-choice-Option-5-5"]').click();
            await page.locator('#qc-select-single-choice-input').press('ArrowDown');

            await expect(
                page.locator('#qc-select-single-choice-items >> li')
                    .filter({ has: page.getByText(/^Option 5$/gm) })
            ).toBeFocused();
        });
    }
);

test.describe('recherche', () => {
    test('Test de recherche avec champ de recherche', {
        annotation: {
            type: 'description',
            description: 'Soit liste déroulante avec champ de recherche est ouverte, en tapant un caractère imprimable, alors ajoute le texte à la recherche'
        }
    }, async ({ page, browserName }) => {
        await page.locator('#qc-select-single-choice-search-input').click();
        await page.getByRole('searchbox', { name: 'Rechercher...' }).fill('12');

        await expect(page.locator('#qc-select-single-choice-search-search')).toHaveValue('12');
        await expect(page.locator('#qc-select-single-choice-search-items')).toMatchAriaSnapshot(`
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

        await expect(page.locator('#qc-select-single-choice-search-search')).toHaveValue('');
        await expect(page.locator('#qc-select-single-choice-search-items')).toMatchAriaSnapshot(`
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
        await page.locator('#qc-select-single-choice-search-input').click();
        await page.locator('#qc-select-single-choice-search-input').click();
        await expect(page.locator('#qc-select-single-choice-search-search')).toHaveValue('');
        await expect(page.locator('#qc-select-single-choice-search-items')).toMatchAriaSnapshot(`
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

    test('Test de recherche sans champ de recherche', {
        annotation: {
            type: 'description',
            description: 'Soit liste déroulante sans champ de recherche, en tapant un caractère imprimable, alors focus sur le premier élément correspondant'
        }
    }, async ({ page }) => {
        await page.locator('#qc-select-single-choice-input').click();
        await page.locator('#qc-select-single-choice-input').press('1');
        await page.locator('#qc-select-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 1$/gm) })
            .press('2');

        await expect(
            page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 12$/gm) })
        ).toBeFocused();

        await page.locator('#qc-select-single-choice-input').click({clickCount: 2});
        await page.locator('#qc-select-single-choice-input').press('1');
        await page.locator('#qc-select-single-choice-items >> li')
            .filter({ has: page.getByText(/^Option 1$/gm) })
            .press('2');

        await expect(
            page.locator('#qc-select-single-choice-items >> li')
                .filter({ has: page.getByText(/^Option 12$/gm) })
        ).toBeFocused();
    });
});

test.describe('choix multiples', () => {
    test('popup choix multiple', {
        annotation: {
            type: 'description',
            description: 'Soit la liste déroulante Choix multiples, en cliquant sur Option 3 et Option 4, alors la popup reste ouverte'
        }
    }, async ({ page }) => {
        await page.locator('#qc-select-multiple-choices-input').click();
        await page.locator('#qc-select-multiple-choices-items').getByText('Option 3').click();

        await expect(page.locator('#qc-select-multiple-choices-popup')).toBeVisible();

        await page.locator('#qc-select-multiple-choices-items').getByText('Option 4').click();

        await expect(page.locator('#qc-select-multiple-choices-popup')).toBeVisible();
    });

    test('choix multiple sélection', {
        annotation: {
            type: 'description',
            description: 'Soit la liste déroulante Choix multiples, en cliquant sur Option 3 et Option 4, alors les 2 options sont listées'
        }
    }, async ({ page }) => {
        await page.locator('#qc-select-multiple-choices-input').click();
        await page.locator('#qc-select-multiple-choices-items').getByText('Option 3').click();
        await page.locator('#qc-select-multiple-choices-items').getByText('Option 4').click();

        await expect(page.locator('#qc-select-multiple-choices-input')).toContainText('Option 3, Option 4');
    });

    test('choix multiples 2 clics par option', {
        annotation: {
            type: 'description',
            description: 'En sélectionnant une option de Choix multiples et en la désélectionnant, alors aucune option n\'est listée'
        }
    }, async ({ page }) => {
        await page.locator('#qc-select-multiple-choices-input').click();
        await page.getByRole('listitem').filter({ hasText: 'Option 2' }).locator('label').click();
        await page.getByRole('listitem').filter({ hasText: 'Option 2' }).locator('label').click();

        await expect(page.locator('#qc-select-multiple-choices-input')).toContainText('');

    });

    test('Choix multiple sélection avec flèches', {
        annotation: {
            type: 'description',
            description: 'Soit une option de choix multiple atteinte avec les flèches, en appuyant sur Espace, alors l\'option est sélectionnée'
        }
    }, async ({ page }) => {
        await page.locator('#qc-select-multiple-choices-input').click();
        await page.locator('#qc-select-multiple-choices-input').press('ArrowDown');
        await page.locator('#qc-select-multiple-choices-items')
            .filter({ has: page.getByText(/^Option 1$/gm) })
            .press('ArrowDown');
        await page.locator('#qc-select-multiple-choices-items')
            .filter({ has: page.getByText(/^Option 2$/gm) })
            .press('ArrowDown');
        await page.locator('#qc-select-multiple-choices-Option-3-3-checkbox')
            .press(' ');

        await expect(page.locator('#qc-select-multiple-choices-input')).toContainText('Option 3');
    });
});

test.describe('formulaire', () => {
    test('formulaire incomplet', {
        annotation: {
            type: 'description',
            description: 'Soit un formulaire de liste déroulante avec champ obligatoire vide, en cliquant sur envoyer, alors erreur affichée et peut être ensuite retirée'
        }
    }, async ({ page }) => {
        await page.getByRole('button', { name: 'Envoyer' }).click();

        await expect(page.locator('#dropdown-list-restaurants-input')).toHaveAttribute('aria-invalid', 'true');
        await expect(page.locator('#dropdown-list-restaurants-error')).toMatchAriaSnapshot(`
        - alert:
          - img
          - text: Veuillez choisir un type de restaurant.
    `);

        await page.getByRole('combobox', { name: 'Types de restaurant' }).click();
        await page.getByRole('listitem').filter({ hasText: 'Pâtisserie' }).click();

        await expect(page.locator('#dropdown-list-restaurants-error')).toHaveCount(0);
    });

    test('envoi formulaire', {
        annotation: {
            type: 'description',
            description: 'Soit un formulaire de liste déroulante avec champ obligatoire vide, en sélectionnant une option et en soumettant, alors alerte d\'envoi de donnée affichée'
        }
    }, async ({ page }) => {
        await page.locator('#dropdown-list-restaurants-input').click();
        await page.getByRole('listitem').filter({ hasText: 'Pâtisserie' }).click();
        await page.locator('#dropdown-list-restaurants-input').click();
        await page.locator('#qc-select-form-test-submit').click();

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
});

test('select navigation détaillée', async ({ page }) => {
    await page.locator('#dropdown-list-restaurants-input').click();
    await page.locator('#dropdown-list-restaurants-search').fill('p');

    await expect(page.locator('#dropdown-list-restaurants-items')).toMatchAriaSnapshot(`
    - list:
        - listitem:
            - checkbox "Pizzeria"
            - text: Pizzeria
        - listitem:
            - checkbox "Pâtisserie"
            - text: Pâtisserie
        - listitem:
            - checkbox "Boîte à pâtes"
            - text: Boîte à pâtes
    - status
    `);

    await page.locator('#dropdown-list-restaurants-items').getByText('Pâtisserie').click();
    await page.locator('#dropdown-list-restaurants-items').getByText('Pâtisserie').press('Escape');
    await page.locator('#dropdown-list-restaurants-input').click();

    await page.locator('#dropdown-list-restaurants-search').click();
    await page.locator('#dropdown-list-restaurants-search').fill('st');

    await expect(page.locator('#dropdown-list-restaurants-items')).toMatchAriaSnapshot(`
    - list:
        - listitem:
            - checkbox "Steakhouse"
            - text: Steakhouse
        - listitem:
            - checkbox "Restaurant à burgers"
            - text: Restaurant à burgers
    - status
    `);

    await page.locator('#dropdown-list-restaurants-items').getByText('Steakhouse').click();

    await expect(page.locator('#dropdown-list-restaurants-input')).toContainText('Pâtisserie, Steakhouse');
});
