import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only'
import livereload from 'rollup-plugin-livereload';
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace';
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import cssReplace from 'postcss-replace'
import pkg from './package.json';


const dev_process = (process.env.npm_lifecycle_event == 'dev');
const verbose = false;
const path = require('path');

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
    processor: css =>
        postcss([
            autoprefixer(),
            cssReplace({
                data: {
                    'pkg-version': pkg.version
                }
            })
        ]),
    sourceMap: false,
    includePaths: [
        path.join(__dirname, '../../node_modules/'),
        'node_modules/',
        'src/sdg/scss',
        __dirname + '/vendor',
    ],
    outputStyle: dev_process ? 'expanded' : 'compressed',
    watch: ['src/sdg/scss', 'src/doc/scss']
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
            customElement: true
        }
    }
    , rollupOptions = [
        {
            // This `main.js` file we wrote
            input: 'src/sdg/qc-sdg.js',
            output: {
                file: dev_process
                        ? 'public/js/qc-sdg.js'
                        : 'dist/js/qc-sdg.min.js',
                format: 'iife',
                name: 'qcSdg'
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
                !dev_process && terser(),

                // will output compiled styles to output.css
                scss(Object.assign({
                    output: dev_process
                        ? 'public/css/qc-sdg.css'
                        : 'dist/css/qc-sdg.min.css'
                    }
                    , scssOptions
                )),
                !dev_process && copy({
                    targets: [
                        {
                            src: `src/sdg/sprites/dist/view/svg/sprite.view.svg`,
                            dest: [`dist/img`,`public/img`],
                            rename: () => 'qc-sprite.svg'
                        },
                        {
                            src: 'src/sdg/sprites/svg/external-link.svg',
                            dest: [`dist/img`,`public/img`],
                        },
                        {
                            src: 'dist/img/*',
                            dest: [`public/img`],
                        }
                    ],
                    verbose: verbose,
                }),
            ],
        },
        {
            // qc-sdg without grid system
            input: 'src/sdg/qc-sdg-no-grid.js',
            output: {
                file: (dev_process ? 'public': 'dist') + '/js/qc-sdg-no-grid.js',
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
                        output: dev_process
                        ? 'public/css/qc-sdg-no-grid.css'
                        : 'dist/css/qc-sdg-no-grid.min.css',
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
                    output: dev_process
                        ? 'public/css/qc-sdg-design-tokens.css'
                        : 'dist/css/qc-sdg-design-tokens.min.css',
                    }
                    , scssOptions
                )),
            ],
        },

    ]
;


if (dev_process) {
    rollupOptions.unshift({
        input: 'src/doc/qc-doc-sdg.js',
        output: {
            file: 'public/js/qc-doc-sdg.js',
            format: 'iife',
        },
        plugins: [
            replace(replacements),
            svelte(svelteOptions),
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs(),
            scss(
                Object.assign(
                    {output: 'public/css/qc-doc-sdg.css'},
                    scssOptions
                )
            ),
            css(),
            serve(),
            //uncomment to enable the Hot Reload,
            // livereload('public'),
        ],
    },)
}

export default rollupOptions;


