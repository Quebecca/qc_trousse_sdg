import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only'
import sveltePreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss'
import replace from '@rollup/plugin-replace';
import postcss from 'postcss'
import cssReplace from 'postcss-replace'
import pkg from './package.json';
import fs from "fs";
import buildHtmlDoc from './plugins/buildHtmlDoc.js';
import buildDevDoc from "./plugins/buildDevDoc"; // adapte le chemin si besoin
import buildTestFixtures from "./plugins/buildTestFixtures";
import buildSvelteTests from "./plugins/buildSvelteTests";


const
    dev_process = (process.env.npm_lifecycle_event == 'dev'),
    version_process = (process.env.npm_lifecycle_event == 'version'),
    build_process = (process.env.npm_lifecycle_event == 'build')
;
const verbose = false;
const  includePaths = [
        dev_process && 'src/doc/scss',
        'src/sdg/scss',
        "src",
].filter(Boolean);

// const path = require('path');

function serve() {
    // Keep a reference to a spawned server process
    let server;

    function toExit() {
        // kill the server if it exists
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            // Spawn a child server process
            server = require('child_process').spawn(
                'npm',
                ['run', 'start', '--', '--dev']
                , {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true,
                }
            );

            // Kill server on process termination or exit
            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        },
    };
}

const scssOptions = {
    includePaths: includePaths,
    processor: css =>
        postcss([
            cssReplace({
                data: {
                    'pkg-version': pkg.version,
                    'dev-env': dev_process ? 'true' : 'false',
                }
            })
        ])
        .process(css, {
            from: undefined
        })
        .then((result) => result.css),
    sourceMap: false,

    prependData: `
        @use "qc-sdg-lib" as *;
    `,
    outputStyle: build_process ? 'compressed' : 'expanded',
    watch: ['src'],
    silenceDeprecations: ['legacy-js-api'],
};

let
    replacements = {
        _vSDG_ : `v${pkg.version}`, //Permet d'injecter la version du package dans le fichier js généré (Remplace _vSDG_ par la version du package)
        customElements$1 : 'customElements', //Ici c'est une patch pour notre wrapper de customElement (permettant les attributs kebab). Je n'ai pas trouvé de façon d'avoir le code au bon format après que svelte a compilé.
        delimiters: ['', ''],
        preventAssignment: false,
    }
    , svelteOptions = {
        compilerOptions: {
            // enable run-time checks
            customElement: true,
            dev: dev_process,
            cssHash: ({ hash, name, filename, css }) => {
                // replacement of default `svelte-${hash(css)}`
                return `qc-hash-${hash(css)}`;
            },
        },
        emitCss: false,
        preprocess: sveltePreprocess({
            scss: scssOptions
        })
    }
    , rollupOptions = [
        {
            // This `main.js` file we wrote
            input: 'src/sdg/qc-sdg.js',
            output: {
                file: build_process
                        ? 'dist/js/qc-sdg.min.js'
                        : 'public/js/qc-sdg.js',
                format: 'iife',
                name: 'qcSdg',
            },
            plugins: [
                replace(replacements),
                svelte(svelteOptions),
                resolve({
                    browser: true,
                    // Force resolving for these modules to root's node_modules that helps
                    // to prevent bundling the same package multiple times if package is
                    // imported from dependencies.
                    dedupe: ['svelte']
                }),
                commonjs(),
                // compress js only when build
                build_process && terser(),

                // will output compiled styles to output.css
                scss(Object.assign({
                    output: (styles, styleNodes) => {
                        fs.writeFileSync(
                            build_process
                            ? 'dist/css/qc-sdg.min.css'
                            : 'public/css/qc-sdg.css'
                            , styles)
                    }}
                    , scssOptions
                )),

            ],
        },
        {
            // qc-sdg without grid system
            input: 'src/sdg/qc-sdg-no-grid.js',
            output: {
                file: (build_process ? 'dist' : 'public') + '/js/qc-sdg-no-grid.js',
                format: 'iife',
            },
            plugins: [
                svelte(svelteOptions),
                resolve({
                    browser: true,
                    // Force resolving for these modules to root's node_modules that helps
                    // to prevent bundling the same package multiple times if package is
                    // imported from dependencies.
                    dedupe: ['svelte']
                }),
                // will output compiled styles to output.css
                scss(Object.assign({
                        output: (styles, styleNodes) => {
                            fs.writeFileSync(
                                build_process
                                    ? 'dist/css/qc-sdg-no-grid.min.css'
                                    : 'public/css/qc-sdg-no-grid.css'
                                , styles)
                        }
                    }
                    , scssOptions
                ))
            ],
        },
        {
            // token only css file
            input: 'src/sdg/qc-sdg-design-tokens.js',
            output: {
                file: 'dist/qc-sdg-design-tokens.js',
                format: 'iife',
            },
            plugins: [
                resolve({
                    browser: true
                }),
                scss(Object.assign({
                        output: (styles, styleNodes) => {
                            fs.writeFileSync(
                                build_process
                                    ? 'dist/css/qc-sdg-design-tokens.min.css'
                                    : 'public/css/qc-sdg-design-tokens.css'
                                , styles)
                        }
                    }
                    , scssOptions
                )),
            ],
        }
    ]
;


if (!build_process) {
    rollupOptions.unshift({
        input: 'src/doc/qc-doc-sdg.js',
        output: {
            file: 'public/js/qc-doc-sdg.js',
            format: 'iife',
        },
        plugins: [
            replace(replacements),
            buildHtmlDoc({
                input: 'src/doc/_index.html',
                output: 'public/index.html'
            }),
            buildDevDoc({
                input: 'src/doc/_dev.html'
            }),
            buildTestFixtures({
                input: 'src/doc/_test.html',
            }),
            buildSvelteTests({
                input: 'tests',
                ignorePathsFile: 'buildSvelteTestsIgnore.json'
            }),
            svelte(svelteOptions),
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs(),
            scss(
                Object.assign({
                        output: (styles, styleNodes) => {
                            fs.writeFileSync(
                                'public/css/qc-doc-sdg.css'
                                , styles)
                        }},
                    scssOptions
                )
            ),
            css(),
            dev_process && serve(),
            //uncomment to enable the Hot Reload,
            // livereload('public'),
        ],
    },
        {
            // token only css file
            input: 'src/sdg/qc-sdg-test.js',
            output: {
                file: 'public/js/qc-sdg-test.js',
                format: 'iife',
            },
            plugins: [
                svelte(svelteOptions),
                resolve({
                    browser: true,
                    // Force resolving for these modules to root's node_modules that helps
                    // to prevent bundling the same package multiple times if package is
                    // imported from dependencies.
                    dedupe: ['svelte']
                }),
            ],
        },)
}

export default rollupOptions;


