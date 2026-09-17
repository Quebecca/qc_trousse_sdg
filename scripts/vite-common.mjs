// Configuration Vite partagée entre le build de production (build-vite.mjs)
// et le serveur de dev (vite.config.js). Reprend fidèlement les options
// svelte + scss de l'ancien rollup.config.js.
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';

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
