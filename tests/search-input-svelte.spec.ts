import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/searchInputSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('SearchInput svelte — état initial', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('searchInput-empty.png', { fullPage: true });
});

test('SearchInput svelte — avec valeur et bouton clear', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await page.locator('input[placeholder="Sans debounce"]').fill('Climat');
    await expect(page).toHaveScreenshot('searchInput-filled.png', { fullPage: true });
});

test('SearchInput svelte — focus', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await page.locator('input[placeholder="Sans debounce"]').focus();
    await expect(page).toHaveScreenshot('searchInput-focus.png', { fullPage: true });
});

test('SearchInput svelte — sans debounce, propagation immédiate', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Sans debounce"]');
    await input.fill('test');
    await expect(input).toHaveValue('test');
});

test('SearchInput svelte — avec debounce, propagation après délai', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    // Horloge virtuelle : le debounce (setTimeout) est piloté par page.clock,
    // ce qui élimine toute dépendance au temps réel (source de flakiness Firefox).
    await page.clock.install();
    const input = page.locator('input[placeholder="Avec debounce"]');
    await input.pressSequentially('abc');
    await expect(input).toHaveValue('abc');

    // Le debounce (300 ms) s'écoule sur l'horloge virtuelle : la valeur reste stable
    await page.clock.runFor(400);
    await expect(input).toHaveValue('abc');
});

test('SearchInput svelte — debounce regroupe les frappes en un seul événement', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await page.clock.install();
    const input = page.locator('input[placeholder="Avec debounce"]');

    // Écouter les événements qc-change directement sur l'input
    await input.evaluate((el) => {
        const events: string[] = [];
        el.addEventListener('qc-change', (e: any) => {
            events.push(e.detail);
        });
        (window as any).__qcChangeEvents = events;
    });

    // Taper rapidement plusieurs caractères (horloge figée : tout se produit à t=0)
    await input.pressSequentially('hello');

    // Horloge non avancée : aucun événement ne doit avoir été émis
    const eventsBeforeDelay = await page.evaluate(() => (window as any).__qcChangeEvents.length);
    expect(eventsBeforeDelay).toBe(0);

    // Avancer l'horloge virtuelle au-delà du debounce (300 ms)
    await page.clock.runFor(350);

    // Un seul événement doit avoir été émis avec la valeur finale
    const eventsAfterDelay = await page.evaluate(() => [...(window as any).__qcChangeEvents]);
    expect(eventsAfterDelay).toHaveLength(1);
    expect(eventsAfterDelay[0]).toBe('hello');
});

test('SearchInput svelte — debounce réinitialise le timer à chaque frappe', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    // Réarmement debounce : test racé sur les 3 moteurs sous Linux (l'ordre entre le handler
    // input/clearTimeout et l'avancée de page.clock n'est pas garanti par Playwright).
    // Déterministe uniquement sur darwin -> joué en local (yarn fastest), skippé en conteneur.
    test.skip(process.platform !== 'darwin', 'Réarmement debounce déterministe seulement sur darwin (course input/horloge en conteneur Linux)');
    await page.clock.install();
    const input = page.locator('input[placeholder="Avec debounce"]');

    // Écouter les événements qc-change directement sur l'input
    await input.evaluate((el) => {
        const events: string[] = [];
        el.addEventListener('qc-change', (e: any) => {
            events.push(e.detail);
        });
        (window as any).__qcChangeEvents2 = events;
    });

    // Taper 'ab', avancer de 200 ms (< debounce), puis taper 'c'
    await input.pressSequentially('ab');
    await page.clock.runFor(200);
    await input.pressSequentially('c');

    // 150 ms après 'c' (< 300 ms) : le premier timer a été annulé, rien n'est émis
    await page.clock.runFor(150);
    const eventsMidway = await page.evaluate(() => (window as any).__qcChangeEvents2.length);
    expect(eventsMidway).toBe(0);

    // Avancer au-delà du debounce final (total 350 ms depuis 'c' > 300 ms)
    await page.clock.runFor(200);
    const eventsFinal = await page.evaluate(() => [...(window as any).__qcChangeEvents2]);
    expect(eventsFinal).toHaveLength(1);
    expect(eventsFinal[0]).toBe('abc');
});

test('SearchInput svelte — clear réinitialise le champ', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Sans debounce"]');
    await input.fill('texte à effacer');
    await expect(input).toHaveValue('texte à effacer');

    await page.getByRole('button', { name: 'Effacer le texte' }).first().click();
    await expect(input).toHaveValue('');
});

test('SearchInput svelte — clear annule le debounce en attente', {
    tag: ['@svelte', '@search-input']
}, async ({ page }) => {
    await page.clock.install();
    const input = page.locator('input[placeholder="Avec debounce"]');

    // Écouter les événements qc-change directement sur l'input
    await input.evaluate((el) => {
        const events: string[] = [];
        el.addEventListener('qc-change', (e: any) => {
            events.push(e.detail);
        });
        (window as any).__qcClearEvents = events;
    });

    // Taper du texte (horloge figée : le debounce est en attente, jamais déclenché)
    await input.pressSequentially('test');

    // Cliquer sur clear avant d'avancer l'horloge
    await page.getByRole('button', { name: 'Effacer le texte' }).last().click();

    // Le champ doit être vide immédiatement
    await expect(input).toHaveValue('');

    // Avancer au-delà du délai de debounce
    await page.clock.runFor(500);

    // Seul l'événement du clear doit avoir été émis (valeur vide),
    // pas celui du debounce avec 'test'
    const events = await page.evaluate(() => [...(window as any).__qcClearEvents]);
    expect(events).toHaveLength(1);
    expect(events[0]).toBe('');
});
