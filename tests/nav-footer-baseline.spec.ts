import {expect, test} from "@playwright/test";
import path = require('path');

// Pied de page de navigation (<qc-nav-footer>). La fixture reprend les exemples de la doc
// (_navFooter.html), dans le même ordre. Elle est jouée à deux largeurs :
// - bureau : 1280 px (grille de trois colonnes à partir de sm, 768 px) ;
// - mobile : 320 px, largeur du cadre mobile Figma (5089:182), strictement sous sm.
// Les états des liens (survol, focus) sont capturés sur l'exemple 1, en haut de page.
// Les captures sont partagées avec le test svelte auto-généré (mêmes noms).
const desktop = {width: 1280, height: 720};
const mobile = {width: 320, height: 720};

test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/navFooterBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
    await page.evaluate(async () => {
        await (document as any).fonts?.ready;
    });
});

test.describe('Pied de page de navigation', () => {
    test('rendu bureau des exemples', {
        tag: ['@baseline', '@nav-footer']
    }, async ({page}) => {
        await page.setViewportSize(desktop);
        await expect(page).toHaveScreenshot('nav-footer-desktop.png', {fullPage: true});
    });

    test('rendu mobile des exemples', {
        tag: ['@baseline', '@nav-footer']
    }, async ({page}) => {
        await page.setViewportSize(mobile);
        await expect(page).toHaveScreenshot('nav-footer-mobile.png', {fullPage: true});
    });

    test('survol d’un lien au-dessus de la ligne : le soulignement disparaît', {
        tag: ['@baseline', '@nav-footer']
    }, async ({page}) => {
        await page.setViewportSize(desktop);
        await page.getByRole('link', {name: 'Joindre [nom de l’organisation]'}).first().hover();
        await expect(page).toHaveScreenshot('nav-footer-hover-links.png');
    });

    test('survol d’un lien de colonne : le lien est souligné', {
        tag: ['@baseline', '@nav-footer']
    }, async ({page}) => {
        await page.setViewportSize(desktop);
        await page.getByRole('link', {name: 'Lien interne'}).first().hover();
        await expect(page).toHaveScreenshot('nav-footer-hover-column.png');
    });

    test('focus sur un lien de colonne : contour visible', {
        tag: ['@baseline', '@nav-footer']
    }, async ({page}) => {
        await page.setViewportSize(desktop);
        await page.getByRole('link', {name: 'Lien interne'}).first().focus();
        await expect(page).toHaveScreenshot('nav-footer-focus.png');
    });

    // L'icône (20 px) dépassait de la boîte du texte (19 px) : le contour de focus en
    // épousait le cran. Le lien est un bloc en ligne qui contient l'icône : une seule boîte,
    // au moins aussi haute que l'icône, donc un contour rectangulaire.
    test('focus sur un lien de média social : contour rectangulaire', {
        tag: ['@baseline', '@nav-footer']
    }, async ({page}) => {
        await page.setViewportSize(desktop);
        const link = page.locator('a.qc-social-facebook').first();
        await link.focus();
        const box = await link.evaluate(element => ({
            fragments: element.getClientRects().length,
            linkHeight: element.getBoundingClientRect().height,
            iconHeight: parseFloat(getComputedStyle(element, '::before').height),
        }));
        expect(box.fragments).toBe(1);
        expect(box.linkHeight).toBeGreaterThanOrEqual(box.iconHeight);
        // Zone de la colonne élargie de 8 px : le contour déborde du bord de la colonne.
        const column = link.locator('xpath=ancestor::*[contains(concat(" ", @class, " "), " qc-nav-footer-column ")]');
        const area = (await column.boundingBox())!;
        await expect(page).toHaveScreenshot('nav-footer-focus-social.png', {
            clip: {x: area.x - 8, y: area.y - 8, width: area.width + 16, height: area.height + 16},
        });
    });

    test('structure : titre h2 par défaut, lien vers l’accueil, repères écrits par l’intégrateur', {
        tag: ['@baseline', '@nav-footer']
    }, async ({page}) => {
        const titles = page.getByRole('heading', {level: 2, name: 'Titre du site ou du service'});
        await expect(titles).toHaveCount(5);
        await expect(titles.first().getByRole('link')).toHaveAttribute('href', '/');
        // Exemple 3 : sans title-url, le titre mène à « / ».
        await expect(titles.nth(2).getByRole('link')).toHaveAttribute('href', '/');
        // Le composant ne rend aucun repère de navigation : seuls ceux de la fixture existent
        // (exemples 1, 3 et 4 : un plan du site chacun ; exemple 5 : deux colonnes nommées ;
        // exemple 4 : les liens utilitaires et légaux du PIV).
        await expect(page.getByRole('navigation', {name: 'Plan du pied de page'})).toHaveCount(3);
        await expect(page.getByRole('navigation', {name: 'Informations et services'})).toHaveCount(1);
        await expect(page.getByRole('navigation', {name: 'Gouvernement'})).toHaveCount(1);
        await expect(page.getByRole('navigation', {name: 'Liens utilitaires et légaux'})).toHaveCount(1);
    });

    // Comportements des attributs du web component. L'élément est créé dans la page : la
    // trousse complète y est chargée, ce test vaut donc aussi pour la page svelte.
    test('attributs : title-tag, valeur invalide, title-text absent, modification après montage', {
        tag: ['@baseline', '@nav-footer']
    }, async ({page}) => {
        const warnings: string[] = [];
        page.on('console', message => {
            if (message.type() === 'warning') {
                warnings.push(message.text());
            }
        });

        await page.evaluate(() => {
            const footer = document.createElement('qc-nav-footer');
            footer.id = 'pied-dynamique';
            footer.setAttribute('title-text', 'Titre dynamique');
            footer.setAttribute('title-tag', 'h4');
            footer.setAttribute('title-url', '/accueil');
            document.body.appendChild(footer);
        });
        const dynamicTitle = page.getByRole('heading', {name: 'Titre dynamique'});
        await expect(dynamicTitle).toHaveJSProperty('tagName', 'H4');
        await expect(dynamicTitle.getByRole('link')).toHaveAttribute('href', '/accueil');

        // Valeur invalide : repli sur h2.
        await page.evaluate(() => document.getElementById('pied-dynamique')!.setAttribute('title-tag', 'h1'));
        await expect(dynamicTitle).toHaveJSProperty('tagName', 'H2');

        // Description ajoutée après le montage.
        await page.evaluate(() => document.getElementById('pied-dynamique')!.setAttribute('description', 'Description ajoutée'));
        await expect(page.getByText('Description ajoutée')).toBeVisible();

        // title-text retiré : aucun titre, avertissement dans la console.
        await page.evaluate(() => document.getElementById('pied-dynamique')!.removeAttribute('title-text'));
        await expect(dynamicTitle).toHaveCount(0);
        await expect.poll(() => warnings.some(text => text.includes('title-text'))).toBe(true);
    });
});
