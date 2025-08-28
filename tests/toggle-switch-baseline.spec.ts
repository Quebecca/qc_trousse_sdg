import {expect, test} from "@playwright/test";
import path = require('path');

test('toggleswitch ref', {
    tag: ['@baseline', '@toggleswitch']
}, async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/toggleSwitchBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);

    await expect(page).toHaveScreenshot('toggleSwitch.png', {fullPage: true});
});
