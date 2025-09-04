import {expect, test} from "@playwright/test";
import path = require('path');

test('toggleswitch ref', {
    tag: ['@baseline', '@toggleswitch']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/toggleSwitch.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await expect(page).toHaveScreenshot('toggleSwitch.png', {fullPage: true});
});
/* test des composants svelte */
test('toggleswitch svelte', {
    tag: ['@svelte', '@toggleswitch']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/toggleSwitchEmbedded.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await expect(page).toHaveScreenshot('toggleSwitch.png', {fullPage: true});
});