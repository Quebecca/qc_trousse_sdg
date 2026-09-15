import { test, expect } from '@playwright/test';
import * as sass from 'sass';
import * as path from 'path';

// Test de propriété de la fonction rem() (issue #48).
//
// La trousse est livrée en deux variantes de root-font-size (62,5 % et 100 %,
// suffixe -rfz100). La seule chose qui change entre les deux CSS est la
// conversion px -> rem, entièrement portée par rem() / rem-ratio() dans
// src/sdg/scss/lib/_functions.scss. Tant que cette fonction respecte son
// invariant, toute valeur exprimée via rem() rend le MEME pixel dans les deux
// variantes -- inutile de dupliquer les captures visuelles.
//
// Invariant vérifié : pour tout px et tout root-font-size,
//   rem(px)  ×  (font-size du :root, en px)  ==  px
// où la font-size du :root vaut percent% de la base navigateur (16 px).

const scssRoot = path.resolve(__dirname, '../src/sdg/scss');
const srcRoot = path.resolve(__dirname, '../src');

/** Compile `rem(px)` (et `rem-ratio(px)`) pour un root-font-size donné et
 *  retourne les deux valeurs numériques en rem. */
function remValues(px: number, percent: number): { rem: number; remRatio: number } {
    const css = sass.compileString(
        `@use "settings/base" with ($percent-root-font-size: ${percent});
         @use "lib/functions" as *;
         a { width: rem(${px}); height: rem-ratio(${px}) }`,
        { loadPaths: [scssRoot, srcRoot] },
    ).css;
    const rem = css.match(/width:\s*(-?[0-9.]+)rem/);
    const remRatio = css.match(/height:\s*(-?[0-9.]+)rem/);
    if (!rem || !remRatio) {
        throw new Error(`Sortie rem() introuvable pour rem(${px}) @ ${percent}% :\n${css}`);
    }
    return { rem: parseFloat(rem[1]), remRatio: parseFloat(remRatio[1]) };
}

// Valeurs de root-font-size : les deux livrées (62,5 / 100) + quelques autres
// pour prouver que l'invariant ne dépend d'aucune valeur particulière.
const percents = [62.5, 100, 75, 50, 120, 200];
// Échantillon de tailles px représentatif (tokens, bordures, grandes tailles).
const pixels = [1, 2, 8, 10, 14, 16, 18, 20, 24, 32, 48, 100];

test('rem() : px -> rem rend le meme pixel quel que soit le root-font-size', () => {
    for (const percent of percents) {
        const rootPx = (percent / 100) * 16; // font-size du :root en px
        for (const px of pixels) {
            const { rem } = remValues(px, percent);
            // rem × taille du root (px) doit redonner exactement le px d'origine.
            expect(rem * rootPx, `rem(${px}) @ ${percent}%`).toBeCloseTo(px, 5);
        }
    }
});

test('rem() et rem-ratio() produisent la meme valeur', () => {
    for (const percent of percents) {
        for (const px of pixels) {
            const { rem, remRatio } = remValues(px, percent);
            expect(remRatio, `rem-ratio(${px}) @ ${percent}%`).toBeCloseTo(rem, 9);
        }
    }
});

test('valeurs de reference documentees dans _functions.scss', () => {
    // Exemples cités dans la doc de rem() : rem(16) == 1.6rem à 62,5 %, 1rem à 100 %.
    expect(remValues(16, 62.5).rem).toBeCloseTo(1.6, 5);
    expect(remValues(16, 100).rem).toBeCloseTo(1, 5);
});
