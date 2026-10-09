import { test, expect } from '@playwright/test';
import path from 'path';

// Régression visuelle EXHAUSTIVE du composant qc-icon (mode font par défaut).
// La fixture est générée depuis icon-codepoints.json : toutes les icônes du subset
// sont rendues (outlined + filled), donc une icône cassée par une maj de police
// fait échouer le snapshot partagé baseline/svelte.
// Le spec -svelte est AUTO-GÉNÉRÉ depuis celui-ci (plugins/buildSvelteTests.mjs) :
// baseline et svelte partagent le même snapshot `icon.png`.
//
// FIX ADOPTÉ (qc-icon:defined { display: inline-flex } dans _icons.scss) : le host
// <qc-icon> retombait sinon sur display:inline, dont la line-box ajoutait ~2px sous le
// glyphe (28x30 vs 28x28) — écart qui dérivait sur toute la page (~36px cumulés). Le fix
// aligne le WC sur le rendu du composant : le baseline est vert et déterministe.
//
// ⚠️ DIVERGENCE RÉSIDUELLE (svelte) — connue et acceptée, NE PAS forcer :
// le harnais Svelte monte <Icon> nu (span inline-block) alors que le WC pose le host
// inline-flex. En rendu ISOLÉ l'écart est ~sous-pixel ; dans la section « icône au fil
// du texte » (running text) le span inline-block prend une line-box plus haute que le
// host inline-flex -> le svelte est ~106px plus haut. C'est une limite de fidélité du
// harnais (pas un bug du composant livré). Le snapshot partagé fait foi = rendu du WC.

const htmlFilePath = path.resolve(__dirname, '..', 'public', 'iconBaseline.test.html');

test('Icon — couverture exhaustive du subset', {
  tag: ['@baseline', '@icon']
}, async ({ page }) => {
  await page.goto(`file://${htmlFilePath}`);
  // Rendu déterministe : les <qc-icon> (et le wrapper svelte) s'upgradent de façon
  // ASYNCHRONE, ce qui fait grandir la mise en page après le load → la hauteur du
  // fullPage varie d'un run à l'autre et le snapshot devient flaky. On attend donc
  // (1) le chargement EFFECTIF de la police d'icônes — `document.fonts.ready` est une
  // Promise, il faut l'awaiter, pas la passer à waitForFunction qui la voit truthy —
  // puis (2) la STABILISATION de la hauteur du document sur plusieurs frames.
  await page.evaluate(async () => {
    await (document as any).fonts?.ready;
    await new Promise<void>((resolve) => {
      let lastHeight = -1;
      let stableFrames = 0;
      const tick = () => {
        const h = document.body.scrollHeight;
        if (h === lastHeight) {
          if (++stableFrames >= 10) return resolve();
        } else {
          stableFrames = 0;
          lastHeight = h;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
  await expect(page).toHaveScreenshot('icon.png', { fullPage: true });
});
