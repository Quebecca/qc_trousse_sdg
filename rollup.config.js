import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'

import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

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
    processor: () => postcss([autoprefixer()]),
    sourceMap: true,
    includePaths: [
        path.join(__dirname, '../../node_modules/'),
        'node_modules/',
        'src/scss',
    ],
    // outputStyle: 'compressed',
    watch: 'src/scss',
};
export default [
    {
        input: 'src/qc-catalog-sdg.js',
        output: {
            file: 'public/css/qc-catalog-sdg.js',
            format: 'iife'
        },
        plugins: [
            resolve({
                browser: true
            }),
            serve(),
            //Enable the Hot Reload
            livereload('public'),
            scss(scssOptions)
        ],
    },
    {
        // This `main.js` file we wrote
        input: 'src/qc-sdg.js',
        output: {
            file: 'dist/css/qc-sdg.js',
            format: 'iife',
        },
        plugins: [
            // svelte({
            //     include: 'src/**/*.svelte',
            // }),
            // Tell any third-party plugins that we're building for the browser
            resolve({
                browser: true
            }),
            // will output compiled styles to output.css
            scss(scssOptions),
        ],
    },
    {
        // token only css file
        input: 'src/qc-sdg-design-tokens.js',
        output: {
            file: 'dist/css/qc-sdg-design-tokens.js',
            format: 'iife',
        },
        plugins: [
            resolve({
                browser: true
            }),
            scss(scssOptions),
        ],
    },
    {
        // last process without output to move, copy, delete operations
        input: 'src/qc-sdg.js',
        watch: {
            skipWrite: true, // prevent output generation
        },
        plugins: [
            scss(), // needed, since the script contains scss…
            del({ // deletion of uneeded js files
                targets: [
                    'public/css/qc-catalog-sdg.js',
                    'dist/css/qc-sdg.js',
                    'dist/css/qc-sdg-design-tokens.js'
                ],
                verbose: true
            }),
            copy({
                targets: [
                    {src: `assets/*`, dest: [`dist`,`public`]},
                    {src: [`dist/css/qc-sdg.css`,`dist/css/qc-sdg.css.map`], dest: `public/css`},
                ],
                verbose: true,
            }),
        ]
    },
];