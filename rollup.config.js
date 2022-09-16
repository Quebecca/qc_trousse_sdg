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

            // will output compiled styles to output.css
            scss({
                processor: () => postcss([autoprefixer()]),
                includePaths: [
                    path.join(__dirname, '../../node_modules/'),
                    'node_modules/',
                    'src/scss',
                ],
                outputStyle: 'compressed',
                watch: 'src/scss',
            })
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
            //     // Tell the svelte plugin where our svelte files are located
            //     include: 'src/**/*.svelte',
            // }),
            // Tell any third-party plugins that we're building for the browser
            resolve({
                browser: true
            }),
            // will output compiled styles to output.css
            scss({
                processor: () => postcss([autoprefixer()]),
                includePaths: [
                    path.join(__dirname, '../../node_modules/'),
                    'node_modules/',
                    'src/scss',
                ],
                outputStyle: 'compressed',
                watch: 'src/scss',
            }),
            copy({
                targets: [
                    {src: `assets/*`, dest: `dist`},
                    {src: `dist/css/qc-sdg.css`, dest: `public/css/`},
                ]
            }),
            del({targets: 'public/css/qc-catalog-sdg.js', verbose: true})
        ],
    },
];