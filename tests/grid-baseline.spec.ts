import {expect, test} from "@playwright/test";
import path = require('path');

// La grille est purement CSS (pas de composant) -> baseline seul (entrée dans
// buildSvelteTestsIgnore.json, pas de -svelte généré).
//
// rem-parity ne couvre qu'une facette (invariant px->rem de la fonction rem()).
// Ici on capture le RENDU de _grid.scss / _grid-lib.scss : conteneurs, rangée,
// colonnes fixes/auto/responsives, décalages, ordre, row-cols, no-gutters.
//
// MULTI-VIEWPORT : les classes à infixe (.qc-col-{sm,md,lg}-N, .qc-offset-md-N)
// ne s'activent qu'au-delà de leur point de rupture (sm=768, md=992, lg=1200).
// On capture donc deux viewports pour prouver la bascule :
//   - lg (1280) : tous les infixes actifs, réagencement complet ;
//   - mobile (projets mobile-chrome/mobile-safari, @mobile) : sm/md/lg retombent à 100 %
//     -> colonnes empilées.
test.beforeEach(async ({page}) => {
    const htmlFilePath = path.resolve(__dirname, '../public/gridBaseline.test.html');
    await page.goto(`file://${htmlFilePath}`);
});

test.describe('Grille', () => {
    test('rendu de référence — viewport lg (1280)', {
        tag: ['@baseline', '@grid']
    }, async ({page}) => {
        await page.setViewportSize({width: 1280, height: 720});
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('grid-lg.png', {fullPage: true});
    });

    // Cas mobile (xs, empilement) : joué par mobile-chrome (393) et mobile-safari (390),
    // sans setViewportSize. À < 768 px, sm/md/lg retombent à 100 %.
    test('rendu de référence — mobile (empilement)', {
        tag: ['@baseline', '@grid', '@mobile']
    }, async ({page}) => {
        await page.evaluate(async () => {
            await (document as any).fonts?.ready;
        });
        await expect(page).toHaveScreenshot('grid-mobile.png', {fullPage: true});
    });
});
