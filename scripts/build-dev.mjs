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
import { build, createLogger } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import replace from '@rollup/plugin-replace';
import { sveltePlugin, cssPreprocessorOptions } from './vite-common.mjs';
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

// Vite avertit pour chaque url() de police non résolue au build
// (« … didn't resolve at build time, it will remain unchanged … »). C'est le
// comportement VOULU ici : $google-font-path pointe vers ../../dist/fonts
// (dist/ est un dossier FRÈRE de public/, résolu au runtime en file://), donc
// le chemin DOIT rester inchangé — pas de resolve.alias, sinon Vite bundlerait
// les polices et casserait la doc statique. Aucune annotation par-url n'existe :
// on filtre ce message précis via un logger custom (le reste passe normalement).
const logger = createLogger('warn');
const drop = (msg) => typeof msg === 'string' && msg.includes("didn't resolve at build time");
const baseWarn = logger.warn.bind(logger);
const baseWarnOnce = logger.warnOnce.bind(logger);
logger.warn = (msg, options) => { if (!drop(msg)) baseWarn(msg, options); };
// Vite déduplique les avertissements d'url() CSS via warnOnce (canal distinct de warn).
logger.warnOnce = (msg, options) => { if (!drop(msg)) baseWarnOnce(msg, options); };

// Sorties dev identiques à l'ancien build rollup (public/, non-min, expanded).
const bundles = [
    { entry: 'src/sdg/qc-sdg.js',               name: 'qcSdg',            js: 'public/js/qc-sdg.js',              css: 'public/css/qc-sdg.css' },
    { entry: 'src/sdg/qc-sdg-no-grid.js',       name: 'qcSdgNoGrid',      js: 'public/js/qc-sdg-no-grid.js',      css: 'public/css/qc-sdg-no-grid.css' },
    { entry: 'src/sdg/qc-sdg-design-tokens.js', name: 'qcSdgDesignTokens', js: 'dist/qc-sdg-design-tokens.js', css: 'public/css/qc-sdg-design-tokens.css' },
    { entry: 'src/doc/qc-doc-sdg.js',           name: 'qcDocSdg',         js: 'public/js/qc-doc-sdg.js',          css: 'public/css/qc-doc-sdg.css', includeDoc: true },
    { entry: 'src/sdg/qc-sdg-test.js',          name: 'qcSdgTest',        js: 'public/js/qc-sdg-test.js',         css: null },
];

const tmpRoot = path.join(root, '.vite-tmp-dev');

async function buildBundle(b) {
    const tmp = path.join(tmpRoot, b.name);
    fs.rmSync(tmp, { recursive: true, force: true });
    await build({
        root,
        configFile: false,
        mode: 'development',
        logLevel: 'warn',
        customLogger: logger,
        // svelte dev:false : `vite build` le force de toute façon (le plugin
        // décide sur la commande, pas le mode) -> on l'aligne pour éviter
        // l'avertissement. Bundles non-minifiés (minify:false) + CSS expanded.
        plugins: [replace(replacements), sveltePlugin({ isBuild: true })],
        resolve: { dedupe: ['svelte'] },
        publicDir: false,
        // En dev, src/doc/scss est en tête des loadPaths pour TOUS les bundles
        // (comme l'includePaths rollup) -> settings/_base override
        // $google-font-path vers ../../dist/fonts (polices servies depuis dist/).
        css: { preprocessorOptions: cssPreprocessorOptions({ root, isBuild: false, includeDoc: true }) },
        build: {
            outDir: tmp,
            emptyOutDir: true,
            minify: false,
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
    const jsDest = path.join(root, b.js);
    fs.mkdirSync(path.dirname(jsDest), { recursive: true });
    fs.copyFileSync(path.join(tmp, 'bundle.js'), jsDest);

    const cssSrc = path.join(tmp, 'bundle.css');
    if (b.css && fs.existsSync(cssSrc)) {
        const cssDest = path.join(root, b.css);
        fs.mkdirSync(path.dirname(cssDest), { recursive: true });
        const css = fs.readFileSync(cssSrc, 'utf-8')
            .replace(/^\uFEFF/, '')
            .replace(/\/\*\$vite\$:\d+\*\//g, '');
        fs.writeFileSync(cssDest, css, 'utf-8');
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
