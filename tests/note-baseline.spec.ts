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

test('Note — terme en en-tête de tableau foncé : texte blanc lisible', {
    tag: ['@note', '@baseline']
}, async ({ page }) => {
    // Sur un en-tête de tableau standard (fond bleu foncé), le terme et son
    // soulignement doivent passer en blanc pour rester lisibles.
    const term = page.locator('qc-note-ref[note-id="h1"] .qc-note-term');
    await expect(term).toBeVisible();
    const color = await term.evaluate(el => getComputedStyle(el).color);
    expect(color).toBe('rgb(255, 255, 255)');
});

test('Note — liste de plusieurs notes : vraie liste avec des éléments de liste', {
    tag: ['@note', '@baseline', '@a11y']
}, async ({ page }) => {
    // Les <li> gardent leur rôle natif listitem : un role sur le <li> le
    // remplacerait et rendrait la liste invalide (axe : aria-required-children).
    const list = page.locator('qc-note-list[scope="test-data"]').getByRole('list');
    await expect(list).toHaveCount(1);
    await expect(list.getByRole('listitem')).toHaveCount(2);
    // Sans titre visible, la liste a un nom par défaut
    await expect(list).toHaveAttribute('aria-label', 'Notes et références');
});

test('Note — liste avec titre : nommée par son titre', {
    tag: ['@note', '@baseline', '@a11y']
}, async ({ page }) => {
    const host = page.locator('qc-note-list[scope="test-terme"]');
    // L'attribut title est retiré du custom element (pas d'infobulle native)
    await expect(host).not.toHaveAttribute('title');
    // Titre toujours en h2
    await expect(host.getByRole('heading', { level: 2, name: 'Notes et références' })).toHaveCount(1);
});

test('Note — mode feuille (mobile) : bouton, et feuille nommée par la note', {
    tag: ['@note', '@baseline', '@a11y']
}, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    // Sous le point de rupture mobile, l'appel devient un vrai bouton
    const call = page.locator('qc-note-ref[note-id="t2"] button');
    await expect(call).toHaveAttribute('aria-haspopup', 'dialog');
    await call.click();
    // La feuille porte le nom de la note, et non le générique « Feuille »
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const label = await dialog.getAttribute('aria-label');
    expect(label).toMatch(/^Note num\u00e9ro \d+$/);
});
