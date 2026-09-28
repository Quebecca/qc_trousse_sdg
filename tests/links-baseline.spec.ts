import {expect, test} from "@playwright/test";
import path = require('path');

// Les liens génériques sont purement CSS (pas de composant). Un unique snapshot
// visuel de la fixture (états défaut / :visited / :hover / :focus / :active,
// simulés par les classes .pseudo-* de la doc, plus des liens au fil du texte)
// valide l'ensemble du rendu du SCSS _links.scss. Le lien externe est couvert
// par external-link-baseline.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/linksBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Liens génériques', () => {
    test('rendu visuel de référence des liens', {
        tag: ['@baseline', '@links']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('links.png', {fullPage: true});
    });
});
