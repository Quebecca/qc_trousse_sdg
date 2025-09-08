import {expect, test} from "@playwright/test";
import path = require('path');

test('toggleswitch svelte', {
    tag: ['@svelte', '@toggleswitch']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/toggleSwitchSvelte.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await expect(page).toHaveScreenshot('toggleSwitch.png', {fullPage: true});
});
