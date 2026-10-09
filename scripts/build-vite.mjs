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
import { sveltePlugin, cssPreprocessorOptions, createQuietLogger } from './vite-common.mjs';
import { compileCssWithMap } from './compile-css-map.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
const logger = createQuietLogger();

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
    { entry: 'src/sdg/qc-sdg.js',               name: 'qcSdg',            js: 'dist/js/qc-sdg.min.js',        css: 'dist/css/qc-sdg.min.css',        scss: 'src/sdg/scss/qc-sdg.scss' },
    // JS commun à qc-sdg.min.js (cf. README) et donc NON livré : pas de `js:`,
    // le stub reste dans le dossier temp ignoré et est jeté avec lui. On garde
    // ces entrées non-cssOnly pour que leur CSS soit compilé à l'identique
    // (cssOnly déclencherait skipAdditionalData et dévierait le CSS).
    { entry: 'src/sdg/qc-sdg-no-grid.js',       name: 'qcSdgNoGrid',                                          css: 'dist/css/qc-sdg-no-grid.min.css',        scss: 'src/sdg/scss/qc-sgd-no-grid.scss' },
    { entry: 'src/sdg/qc-sdg-design-tokens.js', name: 'qcSdgDesignTokens',                                    css: 'dist/css/qc-sdg-design-tokens.min.css',  scss: 'src/sdg/scss/qc-design-tokens.scss' },
    // Variantes « root-font-size 100 % » (issue #48) : stubs JS important un SCSS
    // qui reconfigure $percent-root-font-size:100 puis délègue à l'entrée standard.
    // Le JS est agnostique -> jeté ; seul le CSS est conservé (cssOnly).
    { entry: 'src/sdg/qc-sdg-rfz100.js',               name: 'qcSdgRfz100',            css: 'dist/css/qc-sdg-rfz100.min.css',            cssOnly: true, scss: 'src/sdg/scss/qc-sdg-rfz100.scss' },
    { entry: 'src/sdg/qc-sdg-no-grid-rfz100.js',       name: 'qcSdgNoGridRfz100',      css: 'dist/css/qc-sdg-no-grid-rfz100.min.css',    cssOnly: true, scss: 'src/sdg/scss/qc-sdg-no-grid-rfz100.scss' },
    { entry: 'src/sdg/qc-sdg-design-tokens-rfz100.js', name: 'qcSdgDesignTokensRfz100', css: 'dist/css/qc-sdg-design-tokens-rfz100.min.css', cssOnly: true, scss: 'src/sdg/scss/qc-design-tokens-rfz100.scss' },
];

const tmpRoot = path.join(root, 'dist/.vite-tmp');

for (const b of bundles) {
    // JS : uniquement pour les bundles qui livrent un JS. L'import scss ayant été
    // retiré des entrées, Vite ne compile plus le CSS -> zéro double compilation.
    // Les bundles CSS-only (no-grid, design-tokens, rfz100) ne lancent PAS Vite.
    if (b.js) {
        const tmp = path.join(tmpRoot, b.name);
        fs.rmSync(tmp, { recursive: true, force: true });
        console.log(`\n▶ build JS ${b.name} (${b.entry})`);
        await build({
            root,
            configFile: false,
            logLevel: 'warn',
            customLogger: logger,
            plugins: [
                replace(replacements),
                sveltePlugin({ isBuild: true }),
            ],
            resolve: { dedupe: ['svelte'] },
            publicDir: false,
            // Requis pour compiler les <style lang="scss"> des composants Svelte
            // (loadPaths + additionalData @use "qc-sdg-lib"). L'entrée n'importe
            // plus le scss global, donc Vite ne produit aucun bundle.css.
            css: { preprocessorOptions: cssPreprocessorOptions({ root, isBuild: true }) },
            build: {
                outDir: tmp,
                emptyOutDir: true,
                minify: true,
                cssMinify: false,
                // sourcemap: true -> le JS porte le commentaire sourceMappingURL.
                // On NE copie PAS le .map (prod sans map) : sortie .min IDENTIQUE
                // à `yarn dev`, seul le .map (gitignoré) diffère.
                sourcemap: true,
                lib: {
                    entry: path.join(root, b.entry),
                    formats: ['iife'],
                    name: b.name,
                    fileName: () => 'bundle.js',
                    cssFileName: 'bundle',
                },
            },
        });
        const jsSrc = path.join(tmp, 'bundle.js');
        const jsDest = path.join(root, b.js);
        fs.mkdirSync(path.dirname(jsDest), { recursive: true });
        const jsMapName = path.basename(jsDest) + '.map';
        const js = fs.readFileSync(jsSrc, 'utf-8')
            .replace(/# sourceMappingURL=bundle\.js\.map/, `# sourceMappingURL=${jsMapName}`);
        fs.writeFileSync(jsDest, js, 'utf-8');
        fs.rmSync(jsDest + '.map', { force: true }); // prod = sans map
    }

    // CSS : compilé EN DIRECT par Sass (helper), jamais par Vite.
    // sourceMap:true (commentaire présent) mais writeMap:false (pas de .map en prod).
    if (b.css && b.scss) {
        await compileCssWithMap({
            entryScss: path.join(root, b.scss),
            cssDest: path.join(root, b.css),
            loadPaths: [path.join(root, 'src/sdg/scss'), path.join(root, 'src')],
            minify: true,
            sourceMap: true,
            writeMap: false,
            devEnv: false,
            pkgVersion: pkg.version,
            additionalData: !b.cssOnly,
        });
        console.log(`  ✓ ${b.css}`);
    }
}

fs.rmSync(tmpRoot, { recursive: true, force: true });
console.log('\n✅ build Vite terminé.');
