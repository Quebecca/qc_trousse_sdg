import {test, expect} from "@playwright/test";
import path = require('path');

test.beforeEach(async({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/pivFooterBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('piv footer baseline', {
    tag: ['@baseline', '@piv-footer']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('piv-footer.png', {fullPage: true});
});