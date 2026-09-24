// Compilation CSS via l'API dart-sass, avec sourcemap OPTIONNELLE (dev uniquement).
//
// Pourquoi ne pas laisser Vite s'en charger : `vite build()` n'émet JAMAIS de
// sourcemap CSS (seul le serveur de dev le fait — vérifié empiriquement, quel que
// soit cssMinify / css.devSourcemap). Or le CSS de la trousse provient à 100 % de
// l'entrée SCSS (aucun style de composant Svelte extrait — vérifié : 0 « qc-hash- »
// dans les bundles), donc compiler l'entrée directement avec Sass produit le CSS
// ET sa map en un seul appel, byte-identique à la sortie Vite actuelle.
//
// On rejoue ensuite le MÊME postcss-replace que postcss.config.mjs (jetons
// pkg-version + dev-env), en propageant la map de Sass à travers PostCSS.
import * as sass from 'sass';
import postcss from 'postcss';
import postcssReplace from 'postcss-replace';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Compile une entrée SCSS en CSS (+ .map si `sourceMap`) et l'écrit à `cssDest`.
 * Réplique fidèlement le pipeline Vite : additionalData `@use "qc-sdg-lib"`,
 * loadPaths, style compressed/expanded (via `minify`), puis postcss-replace.
 */
export async function compileCssWithMap({ entryScss, cssDest, loadPaths, minify, sourceMap, writeMap, devEnv, pkgVersion, additionalData = true }) {
    // writeMap : écrit le fichier .map à côté. Par défaut = sourceMap.
    // Le commentaire /*# sourceMappingURL=... */ est ajouté dès que sourceMap est
    // vrai (même si writeMap est faux) -> sortie .min IDENTIQUE entre dev et build,
    // seul le .map (gitignoré) n'étant écrit qu'en dev.
    if (writeMap === undefined) writeMap = !!sourceMap;
    const raw = fs.readFileSync(entryScss, 'utf-8');
    const source = (additionalData ? '@use "qc-sdg-lib" as *;\n' : '') + raw;

    const sassResult = sass.compileString(source, {
        style: minify ? 'compressed' : 'expanded',
        sourceMap: !!sourceMap,
        sourceMapIncludeSources: !!sourceMap,
        charset: false, // pas de BOM/@charset en tête (le build prod le strippe aussi)
        loadPaths,
        url: pathToFileURL(entryScss),
        silenceDeprecations: ['legacy-js-api'],
    });

    const mapName = path.basename(cssDest) + '.map';
    const result = await postcss([
        postcssReplace({ data: { 'pkg-version': pkgVersion, 'dev-env': devEnv ? 'true' : 'false' } }),
    ]).process(sassResult.css, {
        from: entryScss,
        to: cssDest,
        // annotation: mapName -> PostCSS ajoute le commentaire /*# sourceMappingURL=... */
        map: sourceMap ? { prev: sassResult.sourceMap, inline: false, annotation: mapName } : false,
    });

    fs.mkdirSync(path.dirname(cssDest), { recursive: true });
    fs.writeFileSync(cssDest, result.css, 'utf-8');
    if (sourceMap && writeMap && result.map) {
        fs.writeFileSync(cssDest + '.map', result.map.toString(), 'utf-8');
    } else {
        // build (writeMap:false) : pas de .map -> retire une éventuelle map résiduelle d'un dev précédent.
        fs.rmSync(cssDest + '.map', { force: true });
    }
}
