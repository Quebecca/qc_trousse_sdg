import {test, expect} from "@playwright/test";
import path = require('path');

test.beforeEach(async({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/noticeBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test('notice baseline', {
    tag: ['@baseline', '@notice']
}, async ({ page }) => {
    await expect(page).toHaveScreenshot('notice.png', {fullPage: true});
});
