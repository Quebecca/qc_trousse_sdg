// Build de production Vite — équivalent de `rollup -c` (build_process=true).
//
// L'IIFE impose UNE entrée par build : on boucle donc sur l'API build() de Vite,
// une invocation par bundle, chacune en mode `lib` iife. Chaque bundle est écrit
// dans un dossier temporaire puis ses fichiers sont recopiés aux chemins finaux
// exacts (dist/js, dist/css, dist/), pour ne rien changer côté consommateurs.
import { build } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import replace from '@rollup/plugin-replace';
import { sveltePlugin, cssPreprocessorOptions } from './vite-common.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));

// Reprise du @rollup/plugin-replace de rollup.config.js.
// NB : le patch customElements$1 -> customElements est VOLONTAIREMENT absent
// (on teste d'abord si Vite/rolldown en a encore besoin — cf. échange avec Marc).
const replacements = {
    _vSDG_: `v${pkg.version}`,
    delimiters: ['', ''],
    preventAssignment: false,
};

// Chemins de sortie identiques à l'ancien build rollup.
const bundles = [
    { entry: 'src/sdg/qc-sdg.js',               name: 'qcSdg',            js: 'dist/js/qc-sdg.min.js',        css: 'dist/css/qc-sdg.min.css' },
    { entry: 'src/sdg/qc-sdg-no-grid.js',       name: 'qcSdgNoGrid',      js: 'dist/js/qc-sdg-no-grid.js',    css: 'dist/css/qc-sdg-no-grid.min.css' },
    { entry: 'src/sdg/qc-sdg-design-tokens.js', name: 'qcSdgDesignTokens', js: 'dist/qc-sdg-design-tokens.js', css: 'dist/css/qc-sdg-design-tokens.min.css' },
    // Variantes « root-font-size 100 % » (issue #48) : stubs JS important un SCSS
    // qui reconfigure $percent-root-font-size:100 puis délègue à l'entrée standard.
    // Le JS est agnostique -> jeté ; seul le CSS est conservé (cssOnly).
    { entry: 'src/sdg/qc-sdg-rfz100.js',               name: 'qcSdgRfz100',            css: 'dist/css/qc-sdg-rfz100.min.css',            cssOnly: true },
    { entry: 'src/sdg/qc-sdg-no-grid-rfz100.js',       name: 'qcSdgNoGridRfz100',      css: 'dist/css/qc-sdg-no-grid-rfz100.min.css',    cssOnly: true },
    { entry: 'src/sdg/qc-sdg-design-tokens-rfz100.js', name: 'qcSdgDesignTokensRfz100', css: 'dist/css/qc-sdg-design-tokens-rfz100.min.css', cssOnly: true },
];

const tmpRoot = path.join(root, 'dist/.vite-tmp');

for (const b of bundles) {
    const tmp = path.join(tmpRoot, b.name);
    fs.rmSync(tmp, { recursive: true, force: true });

    console.log(`\n▶ build ${b.name} (${b.entry})`);
    await build({
        root,
        configFile: false,
        logLevel: 'warn',
        plugins: [
            replace(replacements),
            sveltePlugin({ isBuild: true }),
        ],
        resolve: { dedupe: ['svelte'] },
        publicDir: false,
        css: { preprocessorOptions: cssPreprocessorOptions({ root, isBuild: true, skipAdditionalData: !!b.cssOnly }) },
        build: {
            outDir: tmp,
            emptyOutDir: true,
            minify: true,
            cssMinify: false,
            lib: {
                entry: path.join(root, b.entry),
                formats: ['iife'],
                name: b.name,
                fileName: () => 'bundle.js',
                cssFileName: 'bundle',
            },
        },
    });

    // Place le JS (sauf variantes cssOnly : le stub JS est jeté).
    if (!b.cssOnly) {
        const jsSrc = path.join(tmp, 'bundle.js');
        const jsDest = path.join(root, b.js);
        fs.mkdirSync(path.dirname(jsDest), { recursive: true });
        fs.copyFileSync(jsSrc, jsDest);
    }

    // Place le CSS (peut être absent si un bundle ne produit aucun style).
    const cssSrc = path.join(tmp, 'bundle.css');
    if (fs.existsSync(cssSrc)) {
        const cssDest = path.join(root, b.css);
        fs.mkdirSync(path.dirname(cssDest), { recursive: true });
        // Nettoyage : Vite injecte un marqueur interne /*$vite$:N*/ en mode lib,
        // et on strippe un éventuel BOM UTF-8 (comme le fix be8687f3 sur main).
        let css = fs.readFileSync(cssSrc, 'utf-8')
            .replace(/^\uFEFF/, '')
            .replace(/\/\*\$vite\$:\d+\*\//g, '');
        fs.writeFileSync(cssDest, css, 'utf-8');
        console.log(`  ✓ ${b.cssOnly ? '' : b.js + '\n  ✓ '}${b.css}`);
    } else {
        console.log(`  ✓ ${b.js}\n  (aucun css produit)`);
    }
}

fs.rmSync(tmpRoot, { recursive: true, force: true });
console.log('\n✅ build Vite terminé.');
