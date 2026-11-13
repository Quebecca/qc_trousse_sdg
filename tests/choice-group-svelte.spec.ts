import { test, expect } from '@playwright/test';
import path = require('path');

test('choice-group radios svelte', {
    tag: ['@svelte', '@radios']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/radiosSvelte.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('radios.png', {fullPage: true});
});

test('choice-group checkbox svelte', {
    tag: ['@svelte', '@checkbox']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/checkboxSvelte.test.html');
      // Navigue vers le fichier en utilisant le protocole file://
      await page.goto(`file://${htmlFilePath}`);
      await expect(page).toHaveScreenshot('checkbox.png',{fullPage: true});
});


// Mobile : Fieldset/_fieldset.scss repasse .qc-field-elements-selection-button à
// grid-template-columns: 1fr sous media-mobile() -> boutons de sélection empilés.
// Test adapté (pas une copie du desktop) : on cible les groupes de boutons de sélection.
test('choice-group radios svelte boutons de sélection mobile', {
    tag: ['@mobile', '@radios']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/radiosSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
    const groupes = page.locator('.qc-field-elements-selection-button');
    await expect(groupes.first()).toBeVisible();
    // Une seule colonne en mobile (les fixtures demandent column-count="2").
    const colonnes = await groupes.first().evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(colonnes).toBe(1);
    await expect(groupes.first()).toHaveScreenshot('choice-group-radios-mobile.png');
});


// Mobile : Fieldset/_fieldset.scss repasse .qc-field-elements-selection-button à
// grid-template-columns: 1fr sous media-mobile() -> boutons de sélection empilés.
// Test adapté (pas une copie du desktop) : on cible les groupes de boutons de sélection.
test('choice-group checkbox svelte boutons de sélection mobile', {
    tag: ['@mobile', '@checkbox']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/checkboxSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
    const groupes = page.locator('.qc-field-elements-selection-button');
    await expect(groupes.first()).toBeVisible();
    // Une seule colonne en mobile (les fixtures demandent column-count="2").
    const colonnes = await groupes.first().evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(colonnes).toBe(1);
    await expect(groupes.first()).toHaveScreenshot('choice-group-checkbox-mobile.png');
});
