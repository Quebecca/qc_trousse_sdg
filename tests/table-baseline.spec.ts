/**
 * Aucune suite Playwright ne teste Table.svelte de manière isolée,
 * et ce choix est volontaire.
 *
 * Table.svelte ne génère pas de rendu visuel propre : il reçoit un <table>
 * dans son slot, puis enrichit son DOM. Le style du mode structured-list est,
 * quant à lui, entièrement porté par le SCSS à travers le sélecteur
 * qc-table[structured-list]. Il dépend donc de l'élément host <qc-table>,
 * et non directement du composant Svelte.
 *
 * Utiliser un <div> comme host dans un test isolé permettrait de vérifier la
 * transformation du DOM, mais pas de reproduire le rendu réel du composant.
 * À l'inverse, imbriquer explicitement <Table> dans un véritable <qc-table>
 * entraînerait un double traitement du même tableau, avec des effets
 * indésirables.
 *
 * Par ailleurs, Table.svelte est utilisé exclusivement par TableWC.svelte
 * (<qc-table>). Il n'existe donc pas de cas d'usage réel où il serait
 * instancié avec un autre host.
 *
 * Les tests présents ici du véritable Web Component <qc-table> couvrent à la fois :
 * - la logique interne de transformation de Table.svelte ;
 * - son intégration avec les attributs du Web Component ;
 * - l'utilisation de $host() ;
 * - la projection du contenu par le slot ;
 * - le rendu visuel desktop et mobile.
 */
import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(
        __dirname,
        '../public/tableBaseline.test.html'
    );

    await page.goto(`file://${htmlFilePath}`);
});

test('Table baseline desktop', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('table.png', {
        fullPage: true
    });
});

test('Table baseline mobile', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    await page.setViewportSize({
        width: 375,
        height: 800
    });

    await expect(page).toHaveScreenshot('table-mobile.png', {
        fullPage: true
    });
});

test('Ajout des data-label', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    const rows = page.locator('#table-structured-list tbody tr');

    const firstRowCells = rows.nth(0).locator('td');
    await expect(firstRowCells.nth(0)).toHaveAttribute('data-label', 'Nom');
    await expect(firstRowCells.nth(1)).toHaveAttribute(
        'data-label',
        'Département'
    );
    await expect(firstRowCells.nth(2)).toHaveAttribute('data-label', 'Poste');

    // Deuxième ligne : mêmes libellés attendus, pour s'assurer que le
    // traitement ne dépend pas de la position de la ligne.
    const secondRowCells = rows.nth(1).locator('td');
    await expect(secondRowCells.nth(0)).toHaveAttribute('data-label', 'Nom');
    await expect(secondRowCells.nth(1)).toHaveAttribute(
        'data-label',
        'Département'
    );
    await expect(secondRowCells.nth(2)).toHaveAttribute('data-label', 'Poste');
});

test('Aucun data-label sans en-tête', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    const cells = page.locator(
        '#table-structured-list-without-header tbody td'
    );

    await expect(cells.first()).not.toHaveAttribute('data-label');
});

test('Liste structurée verticale sans data-label', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    const table = page.locator('#table-structured-list-vertical');

    await expect(table.locator('tbody th').first()).toHaveText('Nom');

    const cells = table.locator('tbody td');

    await expect(cells.first()).toHaveText('Marie Tremblay');
    await expect(cells.first()).not.toHaveAttribute('data-label');
});

test('Aucun data-label sur le tableau standard', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    const cells = page.locator('#table-standard tbody td');

    await expect(cells.first()).not.toHaveAttribute('data-label');
});
test('Ajout des data-label avec en-têtes sans thead', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    const table = page.locator(
        '#table-structured-list-without-thead'
    );

    const firstBodyRowCells = table.locator('tr').nth(1).locator('td');

    await expect(firstBodyRowCells).toHaveCount(3);
    await expect(firstBodyRowCells.nth(0)).toHaveAttribute('data-label', 'Nom');
    await expect(firstBodyRowCells.nth(1)).toHaveAttribute(
        'data-label',
        'Département'
    );
    await expect(firstBodyRowCells.nth(2)).toHaveAttribute('data-label', 'Poste');

    // Deuxième ligne de corps, pour ne pas dépendre uniquement de la
    // première ligne suivant les en-têtes sans <thead>.
    const secondBodyRowCells = table.locator('tr').nth(2).locator('td');

    await expect(secondBodyRowCells).toHaveCount(3);
    await expect(secondBodyRowCells.nth(0)).toHaveAttribute('data-label', 'Nom');
    await expect(secondBodyRowCells.nth(1)).toHaveAttribute(
        'data-label',
        'Département'
    );
    await expect(secondBodyRowCells.nth(2)).toHaveAttribute('data-label', 'Poste');
});

test('Ajout des data-label avec en-têtes fusionnés', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    const rows = page.locator(
        '#table-structured-list-merged-headers tbody tr:has(td)'
    );

    // Première ligne : les 4 colonnes, pas seulement la première.
    const firstRowCells = rows.nth(0).locator('td');
    await expect(firstRowCells.nth(0)).toHaveAttribute(
        'data-label',
        'Régime de base - Taux 2025'
    );
    await expect(firstRowCells.nth(1)).toHaveAttribute(
        'data-label',
        'Régime de base - Taux 2026'
    );
    await expect(firstRowCells.nth(2)).toHaveAttribute(
        'data-label',
        'Régime supplémentaire - Taux 2025'
    );
    await expect(firstRowCells.nth(3)).toHaveAttribute(
        'data-label',
        'Régime supplémentaire - Taux 2026'
    );

    // Deuxième ligne : mêmes libellés par colonne, pour confirmer que le
    // calcul dépend de la position de colonne et non de la ligne.
    const secondRowCells = rows.nth(1).locator('td');
    await expect(secondRowCells.nth(0)).toHaveAttribute(
        'data-label',
        'Régime de base - Taux 2025'
    );
    await expect(secondRowCells.nth(3)).toHaveAttribute(
        'data-label',
        'Régime supplémentaire - Taux 2026'
    );
});

test('Génération des clones pour les cellules avec rowspan', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    const clones = page.locator(
        '#table-structured-list-merged-cells [data-qc-clone]'
    );

    // 2 clones dans la ligne "Classe 6A" (Service, Validité hérités par
    // rowspan) + 1 clone dans la ligne "Véhicule électrique" (Service).
    await expect(clones).toHaveCount(3);
});

test('Contenu et data-label des clones', {
    tag: ['@table', '@baseline']
}, async ({ page }) => {
    const rows = page.locator(
        '#table-structured-list-merged-cells tbody tr'
    );

    // Ligne "Classe 6A" : hérite de 2 cellules par rowspan depuis la
    // ligne précédente.
    const secondRowClones = rows.nth(1).locator('[data-qc-clone]');
    await expect(secondRowClones).toHaveCount(2);
    await expect(secondRowClones.nth(0)).toHaveText('Permis de conduire');
    await expect(secondRowClones.nth(0)).toHaveAttribute(
        'data-label',
        'Service'
    );
    await expect(secondRowClones.nth(1)).toHaveText('2 ans');
    await expect(secondRowClones.nth(1)).toHaveAttribute(
        'data-label',
        'Validité'
    );

    // Ligne "Véhicule électrique" : la cellule avec colspan="2" fusionne
    // les libellés Tarif et Validité avec " / ".
    const mergedCell = rows.nth(3).locator('td').last();
    await expect(mergedCell).toHaveAttribute(
        'data-label',
        'Tarif / Validité'
    );
});