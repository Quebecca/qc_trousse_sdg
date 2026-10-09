import { test, expect } from '@playwright/test';
import path = require('path');

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/iconButtonSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);
    // Le bouton-icône rend des glyphes Material via la police : attendre son chargement.
    await page.waitForFunction(() => (document as any).fonts.ready);
});

test('IconButton svelte', {
    tag: ['@svelte', '@icon-button']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('iconButton.png', { fullPage: true });
});
