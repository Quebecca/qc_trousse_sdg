import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/searchInputBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('SearchInput baseline — état initial', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('searchInput-empty.png', { fullPage: true });
});

test('SearchInput baseline — avec valeur et bouton clear', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    await page.locator('input[placeholder="Sans debounce"]').fill('Climat');
    await expect(page).toHaveScreenshot('searchInput-filled.png', { fullPage: true });
});

test('SearchInput baseline — focus', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    await page.locator('input[placeholder="Sans debounce"]').focus();
    await expect(page).toHaveScreenshot('searchInput-focus.png', { fullPage: true });
});

test('SearchInput baseline — sans debounce, propagation immédiate', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Sans debounce"]');
    await input.fill('test');
    await expect(input).toHaveValue('test');
});

test('SearchInput baseline — avec debounce, propagation après délai', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Avec debounce"]');
    await input.pressSequentially('abc', { delay: 50 });
    await expect(input).toHaveValue('abc');

    await page.waitForTimeout(400);
    await expect(input).toHaveValue('abc');
});

test('SearchInput baseline — debounce regroupe les frappes en un seul événement', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Avec debounce"]');

    // Écouter les événements qc-change directement sur l'input
    await input.evaluate((el) => {
        const events: string[] = [];
        el.addEventListener('qc-change', (e: any) => {
            events.push(e.detail);
        });
        (window as any).__qcChangeEvents = events;
    });

    // Taper rapidement plusieurs caractères (intervalle < debounce)
    await input.pressSequentially('hello', { delay: 30 });

    // Juste après la saisie, aucun événement ne doit avoir été émis
    const eventsBeforeDelay = await page.evaluate(() => (window as any).__qcChangeEvents.length);
    expect(eventsBeforeDelay).toBe(0);

    // Attendre que le debounce se déclenche (300ms + marge)
    await page.waitForTimeout(500);

    // Un seul événement doit avoir été émis avec la valeur finale
    const eventsAfterDelay = await page.evaluate(() => [...(window as any).__qcChangeEvents]);
    expect(eventsAfterDelay).toHaveLength(1);
    expect(eventsAfterDelay[0]).toBe('hello');
});

test('SearchInput baseline — debounce réinitialise le timer à chaque frappe', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Avec debounce"]');

    // Écouter les événements qc-change directement sur l'input
    await input.evaluate((el) => {
        const events: string[] = [];
        el.addEventListener('qc-change', (e: any) => {
            events.push(e.detail);
        });
        (window as any).__qcChangeEvents2 = events;
    });

    // Taper 'ab', attendre 200ms (< debounce), puis taper 'c'
    await input.pressSequentially('ab', { delay: 30 });
    await page.waitForTimeout(200);
    await input.pressSequentially('c', { delay: 30 });

    // Attendre un peu — le premier timer devrait avoir été annulé
    await page.waitForTimeout(150);
    const eventsMidway = await page.evaluate(() => (window as any).__qcChangeEvents2.length);
    expect(eventsMidway).toBe(0);

    // Attendre que le debounce final se déclenche (300ms + marge)
    await page.waitForTimeout(400);
    const eventsFinal = await page.evaluate(() => [...(window as any).__qcChangeEvents2]);
    expect(eventsFinal).toHaveLength(1);
    expect(eventsFinal[0]).toBe('abc');
});

test('SearchInput baseline — clear réinitialise le champ', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Sans debounce"]');
    await input.fill('texte à effacer');
    await expect(input).toHaveValue('texte à effacer');

    await page.getByRole('button', { name: 'Effacer le texte' }).first().click();
    await expect(input).toHaveValue('');
});

test('SearchInput baseline — clear annule le debounce en attente', {
    tag: ['@baseline', '@search-input']
}, async ({ page }) => {
    const input = page.locator('input[placeholder="Avec debounce"]');

    // Écouter les événements qc-change directement sur l'input
    await input.evaluate((el) => {
        const events: string[] = [];
        el.addEventListener('qc-change', (e: any) => {
            events.push(e.detail);
        });
        (window as any).__qcClearEvents = events;
    });

    // Taper du texte (debounce pas encore écoulé)
    await input.pressSequentially('test', { delay: 30 });

    // Cliquer sur clear avant que le debounce ne se déclenche
    await page.getByRole('button', { name: 'Effacer le texte' }).last().click();

    // Le champ doit être vide immédiatement
    await expect(input).toHaveValue('');

    // Attendre au-delà du délai de debounce
    await page.waitForTimeout(500);

    // Seul l'événement du clear doit avoir été émis (valeur vide),
    // pas celui du debounce avec 'test'
    const events = await page.evaluate(() => [...(window as any).__qcClearEvents]);
    expect(events).toHaveLength(1);
    expect(events[0]).toBe('');
});
