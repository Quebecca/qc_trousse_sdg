// Build DEV Vite — équivalent du bloc `if (!build_process)` de rollup.config.js.
//
// Régénère l'intégralité de public/ (le site de doc STATIQUE, consultable en
// file:// depuis le zip téléchargé) :
//   - 5 bundles IIFE non-minifiés (scripts CLASSIQUES -> document.currentScript OK)
//   - CSS expansée servie en fichier (chargée en <link> dans les shadow roots)
//   - index.html + *.dev.html + *.test.html + specs -svelte générés par les 4
//     plugins maison (réutilisés tels quels via leur hook buildStart).
//
// Options : --watch (rebuild sur changement de src/tests/plugins) et --serve
// (sirv sur 127.0.0.1). Marc n'utilise pas le serveur : la cible principale est
// le contenu de public/. On n'efface JAMAIS public/ en bloc (qc-doc-exemple.js,
// images, favicon y sont suivis) — on n'écrit que les fichiers produits.
import { build } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import replace from '@rollup/plugin-replace';
import { sveltePlugin, cssPreprocessorOptions, createQuietLogger } from './vite-common.mjs';
import { compileCssWithMap } from './compile-css-map.mjs';
import buildHtmlDoc from '../plugins/buildHtmlDoc.mjs';
import buildDevDoc from '../plugins/buildDevDoc.mjs';
import buildTestFixtures from '../plugins/buildTestFixtures.mjs';
import buildSvelteTests from '../plugins/buildSvelteTests.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
process.env.QC_DEV = 'true'; // -> postcss dev-env='true' + svelte dev=true
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));

const args = process.argv.slice(2);
const doWatch = args.includes('--watch');
const doServe = args.includes('--serve');

const replacements = {
    _vSDG_: `v${pkg.version}`,
    delimiters: ['', ''],
    preventAssignment: false,
};

// Vite avertit pour chaque url() de police non résolue au build (by design :
// ../../dist/fonts doit rester intact pour la doc file://). Filtre partagé.
const logger = createQuietLogger();

// build DEV : produit les MAPS (npm run build ne les produit pas).
//  - la TROUSSE -> dist/ (minifiée, dev-env=false, MÊME forme que le livrable
//    prod) + .map gitignorée : c'est ce que charge index.html/fixtures via
//    ../dist, donc la map doit vivre là pour que les DevTools remontent au SCSS.
//  - la DOC (qc-doc-sdg, qc-sdg-test) -> public/ (expansée, dev-env=true) + .map.
// public/ ne contient donc QUE les assets de la doc.
// `doc:true` => loadPaths avec src/doc/scss en tête (police servie en ../../dist/fonts) ;
// `doc:false` (trousse->dist) => police en ../fonts, comme le build prod.
const bundles = [
    { entry: 'src/sdg/qc-sdg.js',               name: 'qcSdg',            minify: true,  devEnv: false, doc: false, js: 'dist/js/qc-sdg.min.js', css: 'dist/css/qc-sdg.min.css',              scss: 'src/sdg/scss/qc-sdg.scss' },
    { entry: 'src/sdg/qc-sdg-no-grid.js',       name: 'qcSdgNoGrid',      minify: true,  devEnv: false, doc: false, js: null, css: 'dist/css/qc-sdg-no-grid.min.css',      scss: 'src/sdg/scss/qc-sgd-no-grid.scss' },
    { entry: 'src/sdg/qc-sdg-design-tokens.js', name: 'qcSdgDesignTokens', minify: true, devEnv: false, doc: false, js: null, css: 'dist/css/qc-sdg-design-tokens.min.css', scss: 'src/sdg/scss/qc-design-tokens.scss' },
    { entry: 'src/doc/qc-doc-sdg.js',  name: 'qcDocSdg',  minify: false, devEnv: true, doc: true, js: 'public/js/qc-doc-sdg.js',  css: 'public/css/qc-doc-sdg.css', scss: 'src/doc/scss/qc-doc-sdg.scss' },
    { entry: 'src/sdg/qc-sdg-test.js', name: 'qcSdgTest', minify: false, devEnv: true, doc: true, js: 'public/js/qc-sdg-test.js', css: null },
];

const tmpRoot = path.join(root, '.vite-tmp-dev');

async function buildBundle(b) {
    // JS via Vite uniquement pour les bundles qui livrent un JS. L'import scss
    // ayant été retiré des entrées, Vite ne compile plus le CSS (zéro double
    // compilation). Les bundles CSS-only (no-grid, design-tokens) ne lancent PAS Vite.
    if (b.js) {
        const tmp = path.join(tmpRoot, b.name);
        fs.rmSync(tmp, { recursive: true, force: true });
        await build({
            root,
            configFile: false,
            mode: b.doc ? 'development' : 'production', // trousse -> même mode que build-vite (JS identique)
            logLevel: 'warn',
            customLogger: logger,
            plugins: [replace(replacements), sveltePlugin({ isBuild: true })],
            resolve: { dedupe: ['svelte'] },
            publicDir: false,
            // Requis pour les <style lang="scss"> des composants (loadPaths +
            // additionalData). L'entrée n'importe plus le scss global -> pas de bundle.css.
            css: { preprocessorOptions: cssPreprocessorOptions({ root, isBuild: false, includeDoc: true }) },
            build: {
                outDir: tmp,
                emptyOutDir: true,
                minify: b.minify,
                cssMinify: false,
                sourcemap: true, // le JS porte le commentaire ; dev copie le .map
                lib: {
                    entry: path.join(root, b.entry),
                    formats: ['iife'],
                    name: b.name,
                    fileName: () => 'bundle.js',
                    cssFileName: 'bundle',
                },
            },
        });
        const jsDest = path.join(root, b.js);
        fs.mkdirSync(path.dirname(jsDest), { recursive: true });
        const jsSrc = path.join(tmp, 'bundle.js');
        const jsMapName = path.basename(jsDest) + '.map';
        const js = fs.readFileSync(jsSrc, 'utf-8')
            .replace(/# sourceMappingURL=bundle\.js\.map/, `# sourceMappingURL=${jsMapName}`);
        fs.writeFileSync(jsDest, js, 'utf-8');
        if (fs.existsSync(jsSrc + '.map')) {
            fs.copyFileSync(jsSrc + '.map', jsDest + '.map'); // .map DEV (gitignoré)
        }
    }

    // CSS compilé EN DIRECT par Sass (pas via Vite) pour obtenir la sourcemap
    // CSS que `vite build()` refuse d'émettre. Byte-identique à la sortie Vite
    // (CSS 100 % issu de l'entrée SCSS, aucun style de composant extrait).
    if (b.css && b.scss) {
        await compileCssWithMap({
            entryScss: path.join(root, b.scss),
            cssDest: path.join(root, b.css),
            // doc -> src/doc/scss en tête (police ../../dist/fonts) ;
            // trousse -> sans src/doc/scss (police ../fonts, comme le build prod).
            loadPaths: b.doc
                ? [path.join(root, 'src/doc/scss'), path.join(root, 'src/sdg/scss'), path.join(root, 'src')]
                : [path.join(root, 'src/sdg/scss'), path.join(root, 'src')],
            minify: b.minify,
            sourceMap: true,
            devEnv: b.devEnv,
            pkgVersion: pkg.version,
        });
    }
}

// Réutilise les 4 plugins maison via leur hook buildStart (aucune duplication).
function runDocPlugins() {
    const ctx = { addWatchFile() {}, warn(m) { console.warn('[doc]', m); } };
    buildHtmlDoc({ input: 'src/doc/_index.html', output: 'public/index.html' }).buildStart.call(ctx);
    buildDevDoc({ input: 'src/doc/_dev.html' }).buildStart.call(ctx);
    buildTestFixtures({ input: 'src/doc/_test.html' }).buildStart.call(ctx);
    buildSvelteTests({ input: 'tests', ignorePathsFile: 'buildSvelteTestsIgnore.json' }).buildStart.call(ctx);
}

async function full() {
    const t0 = Date.now();
    runDocPlugins();
    for (const b of bundles) await buildBundle(b);
    fs.rmSync(tmpRoot, { recursive: true, force: true });
    console.log(`✅ build dev -> public/ (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

await full();

if (doServe) {
    // Serveur statique lié à 127.0.0.1 (jamais 0.0.0.0). On sert la RACINE du repo
    // (pas public/) car le CSS de la doc référence les polices en ../../dist/fonts
    // (dist/ est un dossier FRÈRE de public/) -> servir public/ seul les met 404.
    const sirv = path.join(root, 'node_modules/.bin/sirv');
    const srv = spawn(sirv, ['.', '--host', '127.0.0.1', '--port', '5173', '--dev'], { stdio: 'inherit' });
    process.on('SIGTERM', () => srv.kill());
    process.on('exit', () => srv.kill());
    console.log('🌐 doc servie sur http://127.0.0.1:5173/public/');
}

if (doWatch) {
    const { default: chokidar } = await import('chokidar');
    let building = false, again = false;
    const rebuild = async () => {
        if (building) { again = true; return; }
        building = true;
        try { await full(); } catch (e) { console.error('build dev échoué:', e.message); }
        building = false;
        if (again) { again = false; rebuild(); }
    };
    chokidar
        .watch(['src', 'tests', 'plugins'], { cwd: root, ignoreInitial: true, ignored: /-svelte\.spec\.ts$/ })
        .on('all', (evt, p) => { console.log(`↻ ${evt} ${p}`); rebuild(); });
    console.log('👀 watch actif (src, tests, plugins)…');
}
