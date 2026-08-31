import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/noteBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('Note baseline — rendu visuel complet', {
    tag: ['@note', '@baseline']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('note-baseline.png', { fullPage: true });
});

test('Note — variante avec terme : soulignement pointillé visible', {
    tag: ['@note', '@baseline']
}, async ({ page }) => {
    const termLink = page.locator('qc-note-ref[note-id="t1"] a');
    await expect(termLink).toHaveClass(/qc-note-has-term/);
    await expect(termLink).toBeVisible();
});

test('Note — variante sans terme : seul le numéro est affiché', {
    tag: ['@note', '@baseline']
}, async ({ page }) => {
    const ref = page.locator('qc-note-ref[note-id="t2"] a');
    await expect(ref).toBeVisible();
    // Pas de classe has-term
    await expect(ref).not.toHaveClass(/qc-note-has-term/);
});

test('Note — notes partagées : même définition, deux numéros distincts', {
    tag: ['@note', '@baseline']
}, async ({ page }) => {
    const backlinks = page.locator('qc-note-list[scope="test-partage"] .qc-note-backlink');
    await expect(backlinks).toHaveCount(2);
    // Les deux backlinks doivent avoir des numéros différents
    const n1 = await backlinks.nth(0).locator('.qc-note-backlink-number').textContent();
    const n2 = await backlinks.nth(1).locator('.qc-note-backlink-number').textContent();
    expect(n1).not.toEqual(n2);
});

test('Note — trait de séparation visible quand titre présent', {
    tag: ['@note', '@baseline']
}, async ({ page }) => {
    const title = page.locator('qc-note-list[scope="test-terme"] .qc-note-list-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Notes et références');
    // border-top présent
    const borderTop = await title.evaluate(el => getComputedStyle(el).borderTopStyle);
    expect(borderTop).toBe('solid');
});

test('Note — pas de titre ni trait pour les notes de données', {
    tag: ['@note', '@baseline']
}, async ({ page }) => {
    const titles = page.locator('qc-note-list[scope="test-data"] .qc-note-list-title');
    await expect(titles).toHaveCount(0);
});

test('Note — rôles ARIA corrects', {
    tag: ['@note', '@baseline', '@a11y']
}, async ({ page }) => {
    // doc-noteref sur l'appel (mode inline = lien d'ancrage)
    const noteRef = page.locator('qc-note-ref[note-id="t1"] a');
    await expect(noteRef).toHaveAttribute('role', 'doc-noteref');

    // Une seule définition dans ce scope → rendue en <p role="doc-footnote">
    // (et non en <ol><li>, pour éviter une liste à un seul élément).
    const footnote = page.locator('qc-note-list[scope="test-terme"] .qc-note-list-single');
    await expect(footnote).toHaveAttribute('role', 'doc-footnote');
});

test('Note — navigation clavier : clic Entrée sur appel mène au backlink', {
    tag: ['@note', '@baseline', '@a11y']
}, async ({ page }) => {
    const noteRef = page.locator('qc-note-ref[note-id="t1"] a');
    await noteRef.focus();
    await noteRef.press('Enter');
    // Le focus doit être sur le backlink de la définition
    const backlink = page.locator('qc-note-list[scope="test-terme"] .qc-note-backlink').first();
    await expect(backlink).toBeFocused();
});

test('Note — numéro masqué au lecteur d\'écran, étiquette portée par le lien', {
    tag: ['@note', '@baseline', '@a11y']
}, async ({ page }) => {
    // Le numéro visible est purement décoratif : masqué au lecteur d'écran
    // pour éviter une double annonce.
    const number = page.locator('qc-note-ref[note-id="t1"] .qc-note-number');
    await expect(number).toHaveAttribute('aria-hidden', 'true');

    // L'étiquette accessible est portée par le lien lui-même et contient le
    // terme (s'il existe) suivi de « note numéro N ».
    const link = page.locator('qc-note-ref[note-id="t1"] a');
    const label = await link.getAttribute('aria-label');
    expect(label).toMatch(/note num\u00e9ro \d+/i);
});
