import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import cssReplace from 'postcss-replace'
import pkg from './package.json';

const dev_process = process.env.npm_lifecycle_event == 'dev';
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
                ['run', 'start', '--', '--dev'], {
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
    sourceMap: true,
    includePaths: [
        path.join(__dirname, '../../node_modules/'),
        'node_modules/',
        'src/scss',
    ],
    outputStyle: dev_process ? 'expanded' : 'compressed',
    watch: 'src/scss'
};

let svelteOptions = {
    compilerOptions: {
        // enable run-time checks
        customElement: true
    }
};

let addQcNamespaceToBootstrapClasses = (contents, filename) =>
    contents
        .toString()
        .replace(
            /\.(container|row|col|order|offset|d|flex|justify|align|m|#)/g,
            '\.qc-$1'
        );

// rollup tasks finisher
let finisher = {
    input: 'src/qc-sdg.js',
    watch: {
        skipWrite: true, // prevent output generation
    },
    plugins: [
        svelte(svelteOptions),
        scss({output: false}), // needed, since the script contains scss…
        del({ // deletion of uneeded js files
            targets: [
                'dist/qc-sdg-design-tokens.js'
            ],
            verbose: verbose
        }),
        copy({
            targets: [
                {src: `assets/*`, dest: [`dist`, `public`, `build`]},
                {src: [`build/css/qc-sdg.css`, `build/css/qc-sdg.css.map`], dest: `public/css`},
                {src: [`dist/js/qc-sdg.js`], dest: `public/js`}
            ],
            verbose: verbose,
        }),
    ]
};

let rollupOptions = [
    {
        input: 'src/qc-catalog-sdg.js',
        output: {
            file: 'public/js/qc-catalog-sdg.js',
            format: 'iife'
        },
        plugins: [
            resolve({
                browser: true
            }),
            dev_process && serve(),
            //Enable the Hot Reload
            livereload('public'),
            scss(
                Object.assign(
                    scssOptions,
                    {output: 'public/css/qc-catalog-sdg.css'}
                )
            )
        ],
    },
    {
        // This `main.js` file we wrote
        input: 'src/qc-sdg.js',
        output: {
            file: (dev_process ? 'public': 'dist') + '/js/qc-sdg.js',
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
            scss(Object.assign(scssOptions, {
                output: dev_process
                    ? 'public/css/qc-sdg.css'
                    : 'dist/css/qc-sdg.min.css',
            }))
        ],
    },
    {
        // token only css file
        input: 'src/qc-sdg-design-tokens.js',
        output: {
            file: 'dist/qc-sdg-design-tokens.js',
            format: 'iife',
        },
        plugins: [
            resolve({
                browser: true
            }),
            scss(Object.assign(scssOptions,{
                output: dev_process
                    ? 'build/css/qc-sdg-design-tokens.css'
                    : 'dist/css/qc-sdg-design-tokens.min.css',
            })),
        ],
    },
];

if (!dev_process) {
    finisher.plugins.unshift(copy({
        targets: [{
            src: 'node_modules/bootstrap/scss/mixins/_grid-framework.scss',
            dest: 'lib/bootstrap/scss/mixins',
            transform: addQcNamespaceToBootstrapClasses
        }, {
            src: 'node_modules/bootstrap/scss/_grid.scss',
            dest: 'lib/bootstrap/scss',
            transform: addQcNamespaceToBootstrapClasses
        }, {
            src: [
                'node_modules/bootstrap/scss/utilities/_display.scss',
                'node_modules/bootstrap/scss/utilities/_flex.scss',
                'node_modules/bootstrap/scss/utilities/_spacing.scss',
            ],
            dest: 'lib/bootstrap/scss/utilities',
            transform: addQcNamespaceToBootstrapClasses
        },]
    }),);
}
rollupOptions.push(finisher);

export default rollupOptions;


