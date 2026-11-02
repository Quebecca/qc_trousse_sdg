// Configuration Vite partagée entre le build de production (build-vite.mjs)
// et le serveur de dev (vite.config.js). Reprend fidèlement les options
// svelte + scss de l'ancien rollup.config.js.
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createLogger } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

// Libellé de version affiché dans l'index de la doc (placeholder `_vSDG_`).
//
// La source de vérité est le CHANGELOG.md croisé au package.json, PAS la branche
// ni le commit : le même commit buildé depuis main ou depuis develop doit
// afficher la même chose, et un SHA n'apprend rien au lecteur. On lit la 1re
// entrée `## [x.y.z]` du CHANGELOG (la plus récente) ; `lastPublished` = cette
// version (ou, à défaut, le package.json).
//
//  - JALON : si `package.json.version` == dernière version du CHANGELOG, c'est
//    un commit de release (le flux `yarn version` bump les deux ensemble) -> on
//    affiche la version nue, p. ex. `1.6.1`. C'est ce que voit un visiteur d'une release.
//  - DÉVELOPPEMENT : sinon, on affiche `<version>-develop`. Le suffixe `-develop`
//    (pré-release SemVer valide) signale « travail en cours », quelle que soit la
//    branche. Deux cas pour <version> :
//      * la 1re entrée est une version cible bien formée mais != package.json
//        (ex. CHANGELOG déjà à `## [1.6.2]`, package.json encore 1.6.1)
//        -> on l'affiche telle quelle : `1.6.2-develop` (cible déclarée, pas de bump).
//      * la 1re entrée n'est PAS versionnée (ex. `## [latest]`, `## [Non publié]`)
//        -> on repart de la dernière version PUBLIÉE et on déduit le patch suivant :
//        1.6.1 -> `1.6.2-develop`.
//
// Fallback : CHANGELOG illisible / aucune version -> on retombe sur le package.json
// (jalon si tout concorde, sinon `<package.json>-develop`).
export function versionLabel(root, pkgVersion) {
    let md = '';
    try {
        md = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf-8');
    } catch {
        md = '';
    }

    // 1re entrée du CHANGELOG, versionnée ou non : `## [1.6.1] - …` ou `## [latest]`.
    const firstHeading = md.match(/^##\s*\[([^\]]*)\]/m);
    const firstLabel = firstHeading ? firstHeading[1].trim() : '';
    const firstEntryIsVersion = /^\d+\.\d+\.\d+$/.test(firstLabel);

    // Dernière version PUBLIÉE : 1re entrée bien formée du CHANGELOG, sinon package.json.
    const firstVersionInChangelog = (md.match(/^##\s*\[\s*(\d+\.\d+\.\d+)\s*\]/m) || [])[1];
    const lastPublished = firstVersionInChangelog || pkgVersion;

    // Incrémente le patch : 1.6.1 -> 1.6.2.
    const nextPatch = (v) => {
        const [maj, min, pat] = v.split('.').map(Number);
        return `${maj}.${min}.${pat + 1}`;
    };

    // Jalon : la 1re entrée du CHANGELOG est versionnée ET égale au package.json
    // (le flux `yarn version` bump les deux ensemble sur le commit de release).
    // Une 1re entrée non versionnée (`[latest]`) n'est JAMAIS un jalon, même si
    // une version plus bas dans le fichier coïncide avec le package.json.
    if (firstEntryIsVersion && pkgVersion === firstLabel) {
        return `v${firstLabel}`; // commit de release -> version nue, p. ex. v1.6.1
    }

    // Développement : cible déclarée dans le CHANGELOG, sinon patch déduit.
    const devVersion = firstEntryIsVersion ? firstLabel : nextPatch(lastPublished);
    return `v${devVersion}-develop`; // p. ex. v1.6.2-develop
}

// Logger Vite qui masque l'avertissement « … didn't resolve at build time … »
// émis pour CHAQUE url() de police. C'est le comportement VOULU : les @font-face
// pointent vers dist/fonts (dossier FRÈRE de public/, résolu au runtime en
// file://), donc le chemin DOIT rester inchangé — pas de resolve.alias, sinon
// Vite bundlerait les polices et casserait la doc statique. Aucune annotation
// par-url n'existe ; Vite déduplique via warnOnce -> on filtre warn ET warnOnce.
// Partagé par build-dev.mjs et build-vite.mjs.
export function createQuietLogger() {
    const logger = createLogger('warn');
    const drop = (msg) => typeof msg === 'string' && msg.includes("didn't resolve at build time");
    const baseWarn = logger.warn.bind(logger);
    const baseWarnOnce = logger.warnOnce.bind(logger);
    logger.warn = (msg, opts) => { if (!drop(msg)) baseWarn(msg, opts); };
    logger.warnOnce = (msg, opts) => { if (!drop(msg)) baseWarnOnce(msg, opts); };
    return logger;
}

// Plugin svelte équivalent aux svelteOptions de rollup.config.js :
// custom elements, hash de classe css « qc-hash-… », et on ignore le même warning.
export function sveltePlugin({ isBuild }) {
    return svelte({
        compilerOptions: {
            customElement: true,
            dev: !isBuild,
            // Reprise exacte du cssHash rollup : qc-hash-${hash(css)}.
            cssHash: ({ hash, css }) => `qc-hash-${hash(css)}`,
        },
        // Remplace svelte-preprocess : le scss des blocs <style lang="scss">
        // passe par le pipeline CSS de Vite (dep sass).
        preprocess: vitePreprocess(),
        onwarn(warning, handler) {
            if (warning.code === 'custom_element_props_identifier') return;
            handler(warning);
        },
    });
}

// Options scss équivalentes aux scssOptions rollup (includePaths + @use qc-sdg-lib).
// L'injection de version (pkg-version / dev-env) est faite par postcss.config.mjs.
// La compression est faite par sass (style: compressed), comme l'ancien build rollup
// (outputStyle). Vite ne re-minifie PAS le CSS (build.cssMinify: false) pour éviter
// tout lowering du CSS moderne qui dévierait le rendu du design system.
export function cssPreprocessorOptions({ root, includeDoc = false, isBuild = false, skipAdditionalData = false }) {
    return {
        scss: {
            loadPaths: [
                ...(includeDoc ? [path.join(root, 'src/doc/scss')] : []),
                path.join(root, 'src/sdg/scss'),
                path.join(root, 'src'),
            ],
            // Omis pour les entrées qui configurent settings/base via @use ... with()
            // (ex. variantes rfz100) : injecter @use "qc-sdg-lib" chargerait base
            // avant le with() -> erreur « module already loaded ».
            ...(skipAdditionalData ? {} : { additionalData: '@use "qc-sdg-lib" as *;\n' }),
            style: isBuild ? 'compressed' : 'expanded',
            silenceDeprecations: ['legacy-js-api'],
        },
    };
}
