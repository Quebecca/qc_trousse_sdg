import {test} from "@playwright/test";
import path = require('path');
import {link} from "node:fs";

test.beforeEach(async ({ page }) => {
    const htmlFilePath = path.resolve(__dirname, '../public/externalLinkBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

// TODO trouver comment aller forcer le statut visité sur un lien externe
// test.describe('Rendu visuel', () => {
//     test(
//     'should open in new tab', async ({ page }) => {
//         await page.getByRole('link', { name: 'https://www.quebec.ca/' }).evaluate(link: HTMLAnchorElement => {
//             link.
//             });
//     });
// });