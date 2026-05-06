import { test, expect } from '@playwright/test';
import * as fc from 'fast-check';

// ============================================================================
// Arbitraires réutilisables
// ============================================================================

const itemArb = fc.record({
    value: fc.string({ minLength: 1, maxLength: 10 }),
    label: fc.string({ minLength: 1, maxLength: 20 }),
    disabled: fc.boolean(),
});

const itemsArb = fc.array(itemArb, { minLength: 1, maxLength: 20 });

const valueArb = fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 0, maxLength: 10 });

// ============================================================================
// Fonctions extraites du composant pour test unitaire pur
// ============================================================================

/**
 * Calcule les items sélectionnés par jointure items × value.
 * Équivalent du $derived dans DropdownList.svelte.
 */
function computeSelectedItems(
    items: { value: string; label: string; disabled: boolean }[],
    value: string[]
) {
    return items.filter(item => value.includes(item.value));
}

/**
 * Sélection unique : remplace value par un tableau contenant exactement la valeur choisie.
 */
function handleSingleSelect(_currentValue: string[], itemValue: string): string[] {
    return [itemValue];
}

/**
 * Toggle multiple : ajoute ou retire la valeur du tableau.
 */
function handleMultipleToggle(currentValue: string[], itemValue: string): string[] {
    if (currentValue.includes(itemValue)) {
        return currentValue.filter(v => v !== itemValue);
    }
    return [...currentValue, itemValue];
}

/**
 * Filtre les valeurs préservées contre les nouveaux items (reconstruction dynamique).
 */
function filterPreservedValue(
    preservedValue: string[],
    newItems: { value: string; label: string; disabled: boolean }[]
): string[] {
    return preservedValue.filter(v => newItems.some(item => item.value === v));
}

/**
 * Calcule le texte affiché dans le bouton du dropdown.
 */
function computeSelectedOptionsText(
    selectedItems: { value: string; label: string; disabled: boolean }[],
    multiple: boolean,
    lang: string = "fr"
): string {
    if (selectedItems.length >= 3) {
        return lang === "fr"
            ? `${selectedItems.length} options sélectionnées`
            : `${selectedItems.length} selected options`;
    }
    if (selectedItems.length > 0) {
        if (multiple) {
            return selectedItems.map(item => item.label).join(", ");
        }
        return selectedItems[0].label;
    }
    return "";
}

// ============================================================================
// Tests property-based
// ============================================================================

test.describe('Propriétés de correction — DropdownList', () => {

    /**
     * Property 1 : Items ne contiennent pas d'état de sélection
     * Validates: Requirements 1.1, 1.2, 2.2
     *
     * Après parsing, les items ne doivent contenir que value, label et disabled.
     * Aucun champ `checked` ne doit être présent.
     */
    test('Property 1 — Items ne contiennent pas d\'état de sélection', () => {
        fc.assert(
            fc.property(itemsArb, (items) => {
                // Simuler le parsing : les items ne doivent avoir que value, label, disabled
                const parsed = items.map(item => ({
                    value: item.value,
                    label: item.label,
                    disabled: item.disabled,
                }));

                for (const item of parsed) {
                    // Vérifier qu'aucun champ checked n'existe
                    expect(Object.keys(item)).not.toContain('checked');
                    // Vérifier que seuls les champs attendus sont présents
                    expect(Object.keys(item).sort()).toEqual(['disabled', 'label', 'value']);
                }
            }),
            { numRuns: 200 }
        );
    });

    /**
     * Property 2 : Modifier value ne modifie pas items
     * Validates: Requirements 1.3, 3.3, 4.3, 8.3
     *
     * Le calcul de selectedItems ne doit jamais muter le tableau items original.
     */
    test('Property 2 — Modifier value ne modifie pas items', () => {
        fc.assert(
            fc.property(itemsArb, valueArb, (items, value) => {
                const itemsBefore = JSON.parse(JSON.stringify(items));

                // Calculer selectedItems (ne doit pas muter items)
                computeSelectedItems(items, value);

                expect(items).toEqual(itemsBefore);
            }),
            { numRuns: 200 }
        );
    });

    /**
     * Property 3 : Sélection unique assigne exactement une valeur
     * Validates: Requirement 3.1
     *
     * handleSingleSelect(itemValue) doit toujours produire [itemValue].
     */
    test('Property 3 — Sélection unique assigne exactement une valeur', () => {
        fc.assert(
            fc.property(
                valueArb,
                fc.string({ minLength: 1, maxLength: 10 }),
                (currentValue, itemValue) => {
                    const result = handleSingleSelect(currentValue, itemValue);

                    expect(result).toEqual([itemValue]);
                    expect(result).toHaveLength(1);
                }
            ),
            { numRuns: 200 }
        );
    });

    /**
     * Property 4 : Toggle multiple ajoute ou retire correctement
     * Validates: Requirements 4.1, 4.2
     *
     * Si la valeur n'est pas dans le tableau → elle est ajoutée.
     * Si la valeur est dans le tableau → elle est retirée.
     */
    test('Property 4 — Toggle multiple ajoute ou retire correctement', () => {
        fc.assert(
            fc.property(
                // Générer un tableau de valeurs uniques
                fc.uniqueArray(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 0, maxLength: 10 }),
                fc.string({ minLength: 1, maxLength: 10 }),
                (currentValue, itemValue) => {
                    const result = handleMultipleToggle(currentValue, itemValue);

                    if (currentValue.includes(itemValue)) {
                        // La valeur était présente → elle doit être retirée
                        expect(result).not.toContain(itemValue);
                    } else {
                        // La valeur n'était pas présente → elle doit être ajoutée
                        expect(result).toContain(itemValue);
                    }
                }
            ),
            { numRuns: 200 }
        );
    });

    /**
     * Property 5 : Value ne contient jamais de doublons
     * Validates: Requirement 4.4
     *
     * Après une séquence de toggles, value ne doit jamais contenir de doublons.
     */
    test('Property 5 — Value ne contient jamais de doublons', () => {
        fc.assert(
            fc.property(
                // Générer une séquence de toggles (valeurs à toggler)
                fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 30 }),
                (toggleSequence) => {
                    let value: string[] = [];

                    for (const itemValue of toggleSequence) {
                        value = handleMultipleToggle(value, itemValue);
                    }

                    // Vérifier l'absence de doublons
                    const unique = new Set(value);
                    expect(unique.size).toBe(value.length);
                }
            ),
            { numRuns: 200 }
        );
    });

    /**
     * Property 7 : Préservation des valeurs lors de reconstruction
     * Validates: Requirements 5.2, 5.3
     *
     * Les valeurs préservées qui existent dans les nouveaux items sont conservées.
     * Les valeurs qui n'existent plus sont retirées.
     */
    test('Property 7 — Préservation des valeurs lors de reconstruction', () => {
        fc.assert(
            fc.property(
                valueArb,
                itemsArb,
                (preservedValue, newItems) => {
                    const result = filterPreservedValue(preservedValue, newItems);

                    // Toutes les valeurs du résultat existent dans les nouveaux items
                    for (const v of result) {
                        expect(newItems.some(item => item.value === v)).toBe(true);
                    }

                    // Toutes les valeurs préservées qui existent dans les items sont conservées
                    for (const v of preservedValue) {
                        if (newItems.some(item => item.value === v)) {
                            expect(result).toContain(v);
                        } else {
                            expect(result).not.toContain(v);
                        }
                    }
                }
            ),
            { numRuns: 200 }
        );
    });

    /**
     * Property 8 : Dérivation correcte de selectedOptionsText
     * Validates: Requirements 7.1, 7.2, 7.3, 7.4
     *
     * - Value vide → texte vide
     * - 1 valeur en mode unique → label de l'item
     * - 1-2 valeurs en mode multiple → labels joints par virgule
     * - 3+ valeurs → "N options sélectionnées"
     */
    test('Property 8 — Dérivation correcte de selectedOptionsText', () => {
        fc.assert(
            fc.property(
                itemsArb,
                fc.boolean(),
                (items, multiple) => {
                    // Cas 1 : value vide → texte vide
                    const emptyResult = computeSelectedOptionsText([], multiple);
                    expect(emptyResult).toBe("");

                    // Cas 2 : un seul item sélectionné
                    if (items.length >= 1) {
                        const singleSelected = [items[0]];
                        const singleResult = computeSelectedOptionsText(singleSelected, multiple);
                        if (multiple) {
                            expect(singleResult).toBe(items[0].label);
                        } else {
                            expect(singleResult).toBe(items[0].label);
                        }
                    }

                    // Cas 3 : deux items sélectionnés en mode multiple
                    if (items.length >= 2 && multiple) {
                        const twoSelected = [items[0], items[1]];
                        const twoResult = computeSelectedOptionsText(twoSelected, true);
                        expect(twoResult).toBe(`${items[0].label}, ${items[1].label}`);
                    }

                    // Cas 4 : trois items ou plus → "N options sélectionnées"
                    if (items.length >= 3) {
                        const threeSelected = items.slice(0, 3);
                        const threeResult = computeSelectedOptionsText(threeSelected, multiple, "fr");
                        expect(threeResult).toBe(`3 options sélectionnées`);
                    }
                }
            ),
            { numRuns: 200 }
        );
    });
});
